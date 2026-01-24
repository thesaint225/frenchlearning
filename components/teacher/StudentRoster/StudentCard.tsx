import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Student } from '@/lib/types';
import { User, Mail, Calendar, TrendingUp, X } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface StudentCardProps {
  student: Student;
  enrollmentDate?: string;
  onRemove?: (studentId: string) => void;
}

export function StudentCard({ student, enrollmentDate, onRemove }: StudentCardProps) {
  const progress = student.progress;
  const completionRate = progress
    ? Math.round((progress.lessons_completed / progress.total_lessons) * 100)
    : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{student.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  <span>{student.email}</span>
                </div>
              </div>
            </div>
            {progress && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {progress.lessons_completed}/{progress.total_lessons} lessons
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    <span>Avg Score: {progress.average_score}%</span>
                  </div>
                  {enrollmentDate && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(enrollmentDate), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 ml-4">
            <Link href={`/teacher/classes/class1/students/${student.id}`}>
              <Button variant="outline" size="sm">
                View
              </Button>
            </Link>
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(student.id)}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
