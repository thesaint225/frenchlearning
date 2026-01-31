import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import {
  createServerSupabaseClient,
  createAdminSupabaseClient,
} from '@/lib/supabase/server';
import type { Submission } from '@/lib/types';

type SubmissionRow = {
  id: string;
  student_id: string;
  assignment_id: string;
  answers: unknown;
  status: 'draft' | 'submitted' | 'graded';
  score: number | null;
  max_score: number;
  feedback: string | null;
  submitted_at: string | null;
  graded_at: string | null;
  created_at: string;
  updated_at: string | null;
};

function transformSubmissionRow(row: SubmissionRow): Submission {
  return {
    id: row.id,
    student_id: row.student_id,
    assignment_id: row.assignment_id,
    answers: (row.answers as Record<string, unknown>) || {},
    status:
      row.status === 'graded'
        ? 'graded'
        : 'pending',
    score: row.score ?? undefined,
    max_score: row.max_score,
    feedback: row.feedback ?? undefined,
    submitted_at: row.submitted_at ?? row.created_at,
    graded_at: row.graded_at ?? undefined,
  };
}

async function updateAssignmentSubmissionCount(
  admin: ReturnType<typeof createAdminSupabaseClient>,
  assignmentId: string,
): Promise<void> {
  const { count } = await admin
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('assignment_id', assignmentId)
    .eq('status', 'submitted');

  const { data: assignment } = await admin
    .from('assignments')
    .select('class_id')
    .eq('id', assignmentId)
    .single();

  if (!assignment?.class_id) return;

  const { count: enrolledCount } = await admin
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('class_id', assignment.class_id)
    .eq('status', 'active');

  const submissionCount = count ?? 0;
  const totalStudents = enrolledCount ?? 1;
  const completionRate =
    totalStudents > 0 ? (submissionCount / totalStudents) * 100 : 0;

  await admin
    .from('assignments')
    .update({
      submission_count: submissionCount,
      completion_rate: Math.round(completionRate * 100) / 100,
    })
    .eq('id', assignmentId);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, score, feedback } = body as {
      submissionId?: string;
      score?: number;
      feedback?: string;
    };

    if (!submissionId || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'Missing submissionId or valid score' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Only teachers can grade submissions' },
        { status: 403 }
      );
    }

    const admin = createAdminSupabaseClient();
    const { data: submission, error: subError } = await admin
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (subError || !submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    const row = submission as SubmissionRow;
    if (score < 0 || score > row.max_score) {
      return NextResponse.json(
        { error: `Score must be between 0 and ${row.max_score}` },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const { data: updated, error: updateError } = await admin
      .from('submissions')
      .update({
        score,
        feedback: feedback ?? null,
        status: 'graded',
        graded_at: now,
        updated_at: now,
      })
      .eq('id', submissionId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to save grade: ${updateError.message}` },
        { status: 500 }
      );
    }

    const assignmentId = row.assignment_id;
    after(() =>
      updateAssignmentSubmissionCount(createAdminSupabaseClient(), assignmentId)
    );

    return NextResponse.json(
      transformSubmissionRow(updated as SubmissionRow)
    );
  } catch (err) {
    console.error('grade-submission error:', err);
    const message =
      err instanceof Error && err.message.includes('SUPABASE_SERVICE_ROLE_KEY')
        ? 'Server configuration error: add SUPABASE_SERVICE_ROLE_KEY to your .env.local (from Supabase Dashboard → Project Settings → API → service_role key).'
        : 'An unexpected error occurred';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
