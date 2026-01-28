import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Assignment } from '@/lib/types';
import { Calendar, Users, CheckCircle2, Clock, FileX, GraduationCap, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete?: (assignmentId: string) => void;
  /** Map of class id to class name for showing assigned class (from Supabase). */
  classIdToName?: Record<string, string>;
}

const statusConfig = {
  draft: { icon: FileX, label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  published: { icon: CheckCircle2, label: 'Published', color: 'bg-green-100 text-green-700' },
  closed: { icon: Clock, label: 'Closed', color: 'bg-red-100 text-red-700' },
};

export function AssignmentCard({ assignment, classIdToName, onDelete }: AssignmentCardProps) {
  const StatusIcon = statusConfig[assignment.status].icon;
  const statusColor = statusConfig[assignment.status].color;
  const className =
    assignment.class_id && classIdToName
      ? classIdToName[assignment.class_id] ?? null
      : null;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(assignment.id);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{assignment.title}</CardTitle>
            <CardDescription className="line-clamp-2">{assignment.description}</CardDescription>
          </div>
          <div className={cn('px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1', statusColor)}>
            <StatusIcon className="w-3 h-3" />
            {statusConfig[assignment.status].label}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            {className ? (
              <div className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4" />
                <span>{className}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4" />
                <span className="text-amber-600">Unassigned</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Due: {format(new Date(assignment.due_date), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{assignment.submission_count || 0} submissions</span>
            </div>
          </div>
          {assignment.completion_rate !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Completion Rate</span>
                <span>{assignment.completion_rate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${assignment.completion_rate}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-start gap-2 pt-4 mt-auto">
        <Link href={`/teacher/assignments/${assignment.id}/edit`} className="flex-1 min-w-0">
          <Button variant="outline" size="sm" className="w-full h-9 flex items-center justify-center">
            Edit
          </Button>
        </Link>
        <Link href={`/teacher/assignments/${assignment.id}`} className="flex-1 min-w-0">
          <Button variant="outline" size="sm" className="w-full h-9 flex items-center justify-center">
            View
          </Button>
        </Link>
        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9 w-9 flex-shrink-0 flex items-center justify-center p-0"
            title="Delete assignment"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
