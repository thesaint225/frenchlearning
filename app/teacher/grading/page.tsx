'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getSubmissionsByTeacher } from '@/lib/services/submissions';
import { getAssignmentsByTeacher } from '@/lib/services/assignments';
import { Submission, SubmissionStatus } from '@/lib/types';
import { useTeacherId } from '@/lib/hooks/useTeacherId';
import { supabase } from '@/lib/supabase/client';
import { CheckSquare, Clock, User, FileText } from 'lucide-react';
import { ListSkeleton } from '@/components/skeletons/ListSkeleton';
import { format } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type StudentProfilesMap = Record<
  string,
  { full_name: string | null; email: string }
>;

export default function GradingPage() {
  const { teacherId, loading: authLoading, error: authError } = useTeacherId();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignments, setAssignments] = useState<
    Awaited<ReturnType<typeof getAssignmentsByTeacher>>['data']
  >([]);
  const [studentProfiles, setStudentProfiles] = useState<StudentProfilesMap>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<SubmissionStatus | 'all'>(
    'all',
  );
  const [filterAssignment, setFilterAssignment] = useState<string>('all');

  useEffect(() => {
    if (!teacherId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const [submissionsResult, assignmentsResult] = await Promise.all([
        getSubmissionsByTeacher(teacherId),
        getAssignmentsByTeacher(teacherId),
      ]);

      if (submissionsResult.error || !submissionsResult.data) {
        setError(
          submissionsResult.error?.message ?? 'Failed to load submissions',
        );
        setLoading(false);
        return;
      }

      if (assignmentsResult.error || !assignmentsResult.data) {
        setError(
          assignmentsResult.error?.message ?? 'Failed to load assignments',
        );
        setLoading(false);
        return;
      }

      setSubmissions(submissionsResult.data);
      setAssignments(assignmentsResult.data);

      const studentIds = [
        ...new Set(submissionsResult.data.map((s) => s.student_id)),
      ];
      if (studentIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', studentIds);

        const map: StudentProfilesMap = {};
        for (const p of profiles ?? []) {
          map[p.id] = { full_name: p.full_name ?? null, email: p.email ?? '' };
        }
        setStudentProfiles(map);
      }

      setLoading(false);
    };

    fetchData();
  }, [teacherId]);

  const filteredSubmissions = useMemo(() => {
    let filtered = submissions;
    if (filterStatus !== 'all') {
      filtered = filtered.filter((sub) => sub.status === filterStatus);
    }
    if (filterAssignment !== 'all') {
      filtered = filtered.filter(
        (sub) => sub.assignment_id === filterAssignment,
      );
    }
    return filtered;
  }, [submissions, filterStatus, filterAssignment]);

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  if (authLoading || (loading && teacherId)) {
    return <ListSkeleton count={6} showTitle showFilters />;
  }

  if (authError || !teacherId) {
    return (
      <div className='space-y-6'>
        <div>
          <h2 className='text-3xl font-bold text-[#1f1f1f] mb-2'>Grading</h2>
          <p className='text-muted-foreground'>
            Review and grade student submissions
          </p>
        </div>
        <Card>
          <CardContent className='py-12 text-center'>
            <p className='text-destructive mb-4'>
              {authError || 'Please sign in as a teacher to view this page.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <div>
          <h2 className='text-3xl font-bold text-[#1f1f1f] mb-2'>Grading</h2>
          <p className='text-muted-foreground'>
            Review and grade student submissions
          </p>
        </div>
        <Card>
          <CardContent className='py-12 text-center'>
            <p className='text-destructive mb-4'>{error}</p>
            <Button variant='outline' onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl font-bold text-[#1f1f1f] mb-2'>Grading</h2>
        <p className='text-muted-foreground'>
          Review and grade student submissions
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card className='border-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Pending Grades
            </CardTitle>
            <Clock className='h-4 w-4 text-accent' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-accent'>{pendingCount}</div>
            <p className='text-xs text-muted-foreground mt-1'>
              Submissions awaiting review
            </p>
          </CardContent>
        </Card>
        <Card className='border-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Submissions
            </CardTitle>
            <CheckSquare className='h-4 w-4 text-primary' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-primary'>
              {submissions.length}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              All submissions
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter submissions by status and assignment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              <label className='text-sm font-medium mb-2 block'>Status</label>
              <Select
                value={filterStatus}
                onValueChange={(value) =>
                  setFilterStatus(value as SubmissionStatus | 'all')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Status</SelectItem>
                  <SelectItem value='pending'>Pending</SelectItem>
                  <SelectItem value='graded'>Graded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex-1'>
              <label className='text-sm font-medium mb-2 block'>
                Assignment
              </label>
              <Select
                value={filterAssignment}
                onValueChange={setFilterAssignment}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Assignments</SelectItem>
                  {(assignments ?? []).map((assignment) => (
                    <SelectItem key={assignment.id} value={assignment.id}>
                      {assignment.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='space-y-4'>
        {filteredSubmissions.length === 0 ? (
          <Card>
            <CardContent className='py-12 text-center'>
              <p className='text-muted-foreground'>
                No submissions found. Try adjusting your filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSubmissions.map((submission) => {
            const profile = studentProfiles[submission.student_id];
            const studentName = profile?.full_name ?? 'Unknown Student';
            const studentEmail = profile?.email ?? '—';
            const assignmentTitle =
              (assignments ?? []).find((a) => a.id === submission.assignment_id)
                ?.title ?? 'Unknown Assignment';
            const submittedAt = submission.submitted_at;

            return (
              <Card
                key={submission.id}
                className='hover:shadow-lg transition-shadow'
              >
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <CardTitle className='text-lg mb-1'>
                        {studentName}
                      </CardTitle>
                      <CardDescription>{assignmentTitle}</CardDescription>
                    </div>
                    <div
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        submission.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700',
                      )}
                    >
                      {submission.status === 'pending' ? 'Pending' : 'Graded'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                      <div className='flex items-center gap-1'>
                        <User className='w-4 h-4' />
                        <span>{studentEmail}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <FileText className='w-4 h-4' />
                        <span>
                          Submitted:{' '}
                          {submittedAt
                            ? format(new Date(submittedAt), 'MMM d, yyyy HH:mm')
                            : '—'}
                        </span>
                      </div>
                    </div>
                    {submission.status === 'graded' &&
                      submission.score !== undefined && (
                        <div className='flex items-center gap-2'>
                          <span className='text-sm font-medium'>Score:</span>
                          <span className='text-lg font-bold text-primary'>
                            {submission.score} / {submission.max_score}
                          </span>
                          <span className='text-sm text-muted-foreground'>
                            (
                            {Math.round(
                              (submission.score / submission.max_score) * 100,
                            )}
                            %)
                          </span>
                        </div>
                      )}
                    {submission.feedback && (
                      <div className='p-3 bg-gray-50 rounded-md'>
                        <p className='text-sm text-muted-foreground'>
                          <strong>Feedback:</strong> {submission.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardContent className='pt-0'>
                  <Link href={`/teacher/grading/${submission.id}`}>
                    <Button
                      className='w-full'
                      variant={
                        submission.status === 'pending' ? 'default' : 'outline'
                      }
                    >
                      {submission.status === 'pending'
                        ? 'Grade Submission'
                        : 'View Details'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
