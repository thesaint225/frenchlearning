import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Class } from '@/lib/types';
import { Users, ClipboardList, ArrowRight, Settings } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface ClassCardProps {
  class: Class;
}

export function ClassCard({ class: classData }: ClassCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{classData.name}</CardTitle>
            <CardDescription className="line-clamp-2">{classData.description || 'No description'}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{classData.student_count || 0} students</span>
            </div>
            <div className="flex items-center gap-1">
              <ClipboardList className="w-4 h-4" />
              <span>{classData.active_assignments_count || 0} assignments</span>
            </div>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Class Code: </span>
            <span className="font-mono font-semibold">{classData.class_code}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Created {format(new Date(classData.created_at), 'MMM d, yyyy')}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/teacher/classes/${classData.id}`} className="flex-1">
          <Button variant="default" size="sm" className="w-full">
            View Class
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Link href={`/teacher/classes/${classData.id}/settings`}>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
