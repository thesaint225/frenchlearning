'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTestById, getTestAttemptsByTest } from '@/lib/mock-data';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { TestAttempt } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function TestResultsPage() {
  const params = useParams();
  const testId = params.id as string;

  // In a real app, fetch test and attempts from API
  const test = getTestById(testId);
  const attempts = getTestAttemptsByTest(testId).filter(
    (a) => a.status === 'graded' || a.status === 'submitted'
  );

  if (!test) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Test not found</p>
        <Link href="/teacher/tests">
          <Button>Back to Tests</Button>
        </Link>
      </div>
    );
  }

  const gradedAttempts = attempts.filter((a) => a.status === 'graded');
  const averageScore =
    gradedAttempts.length > 0
      ? Math.round(
          (gradedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) /
            gradedAttempts.reduce((sum, a) => sum + a.max_score, 0)) *
            100
        )
      : 0;

  const passingCount = test.passing_score
    ? gradedAttempts.filter(
        (a) => a.score && (a.score / a.max_score) * 100 >= test.passing_score!
      ).length
    : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/teacher/tests/${testId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Test Results</h2>
          <p className="text-muted-foreground">{test.title}</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{attempts.length}</div>
            <div className="text-sm text-muted-foreground">Total Attempts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{gradedAttempts.length}</div>
            <div className="text-sm text-muted-foreground">Graded</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{averageScore}%</div>
            <div className="text-sm text-muted-foreground">Average Score</div>
          </CardContent>
        </Card>
        {test.passing_score && (
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{passingCount}</div>
              <div className="text-sm text-muted-foreground">Passed ({test.passing_score}%)</div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Results</CardTitle>
          <CardDescription>View all test attempt results</CardDescription>
        </CardHeader>
        <CardContent>
          {attempts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No attempts have been submitted yet
            </div>
          ) : (
            <div className="space-y-2">
              {attempts
                .sort((a, b) => {
                  // Sort by score (graded first, then by score descending)
                  if (a.status === 'graded' && b.status !== 'graded') return -1;
                  if (a.status !== 'graded' && b.status === 'graded') return 1;
                  const scoreA = a.score ?? 0;
                  const scoreB = b.score ?? 0;
                  return scoreB - scoreA;
                })
                .map((attempt) => (
                  <ResultRow key={attempt.id} attempt={attempt} test={test} />
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ResultRow({ attempt, test }: { attempt: TestAttempt; test: any }) {
  const percentage = attempt.score !== undefined
    ? Math.round((attempt.score / attempt.max_score) * 100)
    : null;
  const passed = test.passing_score && percentage
    ? percentage >= test.passing_score
    : null;

  return (
    <Link href={`/teacher/tests/${test.id}/grade/${attempt.id}`}>
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{attempt.student?.name}</span>
            <span className="text-sm text-muted-foreground">{attempt.student?.email}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Submitted: {format(new Date(attempt.submitted_at || attempt.started_at), 'MMM d, HH:mm')}</span>
            {attempt.status === 'graded' && attempt.graded_at && (
              <span>Graded: {format(new Date(attempt.graded_at), 'MMM d, HH:mm')}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {attempt.status === 'graded' && percentage !== null ? (
            <>
              <div className="text-right">
                <div className="text-lg font-bold">
                  {attempt.score} / {attempt.max_score}
                </div>
                <div
                  className={cn(
                    'text-sm',
                    passed === true ? 'text-green-600' : passed === false ? 'text-red-600' : ''
                  )}
                >
                  {percentage}%
                  {passed !== null && (
                    <span className="ml-2">
                      {passed ? '✓ Passed' : '✗ Failed'}
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-right">
              <div className="text-sm text-yellow-600 font-medium">Pending Grading</div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
