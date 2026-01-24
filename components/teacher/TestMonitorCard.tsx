import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestAttempt } from '@/lib/types';
import { Clock, CheckCircle2, Circle, FileCheck } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { calculateTimeRemaining } from '@/lib/utils/test-utils';
import Link from 'next/link';

interface TestMonitorCardProps {
  attempt: TestAttempt;
  timeLimitMinutes: number;
}

const statusConfig = {
  not_started: { label: 'Not Started', color: 'bg-gray-100 text-gray-700', icon: Circle },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Clock },
  submitted: { label: 'Submitted', color: 'bg-yellow-100 text-yellow-700', icon: FileCheck },
  graded: { label: 'Graded', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
} as const;

export function TestMonitorCard({ attempt, timeLimitMinutes }: TestMonitorCardProps) {
  const status = statusConfig[attempt.status];
  const StatusIcon = status.icon;

  const timeRemaining =
    attempt.status === 'in_progress'
      ? calculateTimeRemaining(attempt.started_at, timeLimitMinutes)
      : null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{attempt.student?.name || 'Unknown Student'}</h3>
              <div className={cn('px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1', status.color)}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{attempt.student?.email}</p>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <div>Started: {format(new Date(attempt.started_at), 'MMM d, HH:mm')}</div>
              {attempt.submitted_at && (
                <div>Submitted: {format(new Date(attempt.submitted_at), 'MMM d, HH:mm')}</div>
              )}
              {attempt.status === 'in_progress' && timeRemaining && !timeRemaining.expired && (
                <div className="flex items-center gap-1 text-blue-600 font-medium">
                  <Clock className="w-4 h-4" />
                  {timeRemaining.minutes}m {timeRemaining.seconds}s remaining
                </div>
              )}
              {attempt.status === 'in_progress' && timeRemaining?.expired && (
                <div className="text-red-600 font-medium">Time Expired</div>
              )}
              {attempt.status === 'graded' && attempt.score !== undefined && (
                <div className="text-green-600 font-medium">
                  Score: {attempt.score} / {attempt.max_score} ({Math.round((attempt.score / attempt.max_score) * 100)}%)
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {attempt.status === 'submitted' && (
              <Link href={`/teacher/tests/${attempt.test_id}/grade/${attempt.id}`}>
                <Button size="sm" className="bg-primary hover:bg-primary-dark">
                  Grade
                </Button>
              </Link>
            )}
            {attempt.status === 'graded' && (
              <Link href={`/teacher/tests/${attempt.test_id}/grade/${attempt.id}`}>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </Link>
            )}
            {attempt.status === 'in_progress' && (
              <Link href={`/teacher/tests/${attempt.test_id}/grade/${attempt.id}`}>
                <Button size="sm" variant="outline">
                  View Progress
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
