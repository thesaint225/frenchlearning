import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getGuardiansByStudentIdWithClient } from '@/lib/services/guardians';
import { AssignmentResultEmail } from '@/components/emails/AssignmentResultEmail';

const FROM_EMAIL = process.env.FROM_EMAIL ?? 'onboarding@resend.dev';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id } = body as { type?: string; id?: string };

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Missing type or id in body' },
        { status: 400 }
      );
    }

    if (type !== 'assignment' && type !== 'test') {
      return NextResponse.json(
        { error: 'type must be "assignment" or "test"' },
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
        { error: 'Only teachers can notify parents' },
        { status: 403 }
      );
    }

    if (type === 'test') {
      return NextResponse.json(
        { error: 'Test result notifications not yet supported (tests not persisted to DB)' },
        { status: 501 }
      );
    }

    // type === 'assignment': id is submissionId
    const { data: submission, error: subError } = await supabase
      .from('submissions')
      .select('id, student_id, assignment_id, score, max_score, feedback, status')
      .eq('id', id)
      .single();

    if (subError || !submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    const { data: assignment, error: assignError } = await supabase
      .from('assignments')
      .select('id, title')
      .eq('id', submission.assignment_id)
      .single();

    if (assignError || !assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    const studentId = submission.student_id;

    const { data: studentProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', studentId)
      .single();

    const studentName = studentProfile?.full_name ?? 'Student';

    const { data: guardians, error: guardiansError } =
      await getGuardiansByStudentIdWithClient(supabase, studentId);

    if (guardiansError) {
      return NextResponse.json(
        { error: 'Failed to load guardian contacts' },
        { status: 500 }
      );
    }

    const guardianEmails = (guardians ?? []).map((g) => g.email).filter(Boolean);
    if (guardianEmails.length === 0) {
      return NextResponse.json(
        { error: 'No guardian email on file for this student' },
        { status: 400 }
      );
    }

    const score = submission.score ?? '—';
    const maxScore = submission.max_score;
    const feedback = submission.feedback ?? '';
    const scoreText =
      typeof score === 'number'
        ? `${score} / ${maxScore}${feedback ? ` — ${feedback}` : ''}`
        : `Not yet graded.${feedback ? ` Note: ${feedback}` : ''}`;

    const subject = `Result: ${assignment.title} — ${studentName}`;

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email is not configured (RESEND_API_KEY missing)' },
        { status: 503 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: guardianEmails,
      subject,
      react: AssignmentResultEmail({
        studentName,
        assignmentTitle: assignment.title,
        scoreText,
        feedback,
      }),
    });

    if (sendError) {
      console.error('Resend error:', sendError);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, sentTo: guardianEmails });
  } catch (err) {
    console.error('notify-parent error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
