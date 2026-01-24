import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Test } from '@/lib/types';
import { Clock, Calendar, FileQuestion, Users, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { formatTimeLimit, calculateTestStatus } from '@/lib/utils/test-utils';
import Link from 'next/link';

interface TestCardProps {
  test: Test;
}

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: FileQuestion },
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700', icon: Calendar },
  active: { label: 'Active', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  completed: { label: 'Completed', color: 'bg-purple-100 text-purple-700', icon: CheckCircle2 },
  closed: { label: 'Closed', color: 'bg-red-100 text-red-700', icon: XCircle },
} as const;

export function TestCard({ test }: TestCardProps) {
  const currentStatus = calculateTestStatus(test);
  const status = statusConfig[currentStatus];
  const StatusIcon = status.icon;

  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{test.title}</CardTitle>
            <CardDescription className="line-clamp-2">{test.description}</CardDescription>
          </div>
          <div className={cn('px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1', status.color)}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileQuestion className="w-4 h-4" />
              <span>{test.questions.length} questions</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTimeLimit(test.time_limit_minutes)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(test.start_date), 'MMM d, yyyy HH:mm')}</span>
            </div>
            <span className="text-muted-foreground">→</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(test.end_date), 'MMM d, yyyy HH:mm')}</span>
            </div>
          </div>
          {test.attempt_count !== undefined ? (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{test.attempt_count} attempts</span>
              </div>
              {test.average_score !== undefined && (
                <span>Avg: {test.average_score}%</span>
              )}
            </div>
          ) : (
            <div className="h-[24px]"></div>
          )}
          <div className="text-sm">
            <span className="text-muted-foreground">Max Points: </span>
            <span className="font-medium">{test.max_points}</span>
            {test.passing_score && (
              <>
                <span className="text-muted-foreground"> | Passing: </span>
                <span className="font-medium">{test.passing_score}%</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 mt-auto">
        <Link href={`/teacher/tests/${test.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            View
          </Button>
        </Link>
        {currentStatus === 'active' && (
          <Link href={`/teacher/tests/${test.id}/monitor`} className="flex-1">
            <Button variant="default" size="sm" className="w-full bg-primary hover:bg-primary-dark">
              Monitor
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
