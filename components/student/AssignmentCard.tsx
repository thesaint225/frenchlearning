import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Assignment, Submission } from '@/lib/types';
import { Calendar, Clock, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AssignmentCardProps {
  assignment: Assignment;
  submission?: Submission;
}

const statusConfig = {
  not_started: { icon: FileText, label: 'Not Started', color: 'bg-gray-100 text-gray-700' },
  in_progress: { icon: Clock, label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  submitted: { icon: CheckCircle2, label: 'Submitted', color: 'bg-green-100 text-green-700' },
  graded: { icon: CheckCircle2, label: 'Graded', color: 'bg-purple-100 text-purple-700' },
  overdue: { icon: AlertCircle, label: 'Overdue', color: 'bg-red-100 text-red-700' },
};

function getAssignmentStatus(assignment: Assignment, submission?: Submission): keyof typeof statusConfig {
  const now = new Date();
  const dueDate = new Date(assignment.due_date);
  const isOverdue = now > dueDate;

  if (submission) {
    if (submission.status === 'graded') {
      return 'graded';
    }
    if (submission.submitted_at) {
      return 'submitted';
    }
    return 'in_progress';
  }

  if (isOverdue) {
    return 'overdue';
  }

  return 'not_started';
}

export function StudentAssignmentCard({ assignment, submission }: AssignmentCardProps) {
  const status = getAssignmentStatus(assignment, submission);
  const StatusIcon = statusConfig[status].icon;
  const statusColor = statusConfig[status].color;
  const dueDate = new Date(assignment.due_date);
  const now = new Date();
  const isOverdue = now > dueDate;
  const timeUntilDue = formatDistanceToNow(dueDate, { addSuffix: true });

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{assignment.title}</CardTitle>
            <CardDescription className="line-clamp-2">{assignment.description}</CardDescription>
          </div>
          <div className={cn('px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1', statusColor)}>
            <StatusIcon className="w-3 h-3" />
            {statusConfig[status].label}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                Due: {format(dueDate, 'MMM d, yyyy')} {isOverdue && '(Overdue)'}
              </span>
            </div>
            {!isOverdue && (
              <div className="flex items-center gap-1 text-xs">
                <Clock className="w-3 h-3" />
                <span>{timeUntilDue}</span>
              </div>
            )}
          </div>
          {submission && submission.status === 'graded' && submission.score !== undefined && (
            <div className="mt-2 p-2 bg-purple-50 rounded-md">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Score:</span>
                <span className="font-bold text-purple-700">
                  {submission.score} / {submission.max_score}
                </span>
              </div>
              {submission.feedback && (
                <p className="text-xs text-muted-foreground mt-1">{submission.feedback}</p>
              )}
            </div>
          )}
          {submission && submission.status === 'pending' && submission.submitted_at && (
            <div className="mt-2 p-2 bg-green-50 rounded-md">
              <p className="text-xs text-green-700">
                Submitted on {format(new Date(submission.submitted_at), 'MMM d, yyyy')} - Awaiting grade
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/student/assignments/${assignment.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            {status === 'not_started' || status === 'in_progress' || status === 'overdue'
              ? 'Start Assignment'
              : 'View Assignment'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
