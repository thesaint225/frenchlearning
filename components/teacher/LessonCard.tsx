import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lesson } from '@/lib/types';
import { Video, Music, FileQuestion, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Link from 'next/link';

interface LessonCardProps {
  lesson: Lesson;
}

const typeIcons = {
  video: Video,
  audio: Music,
  exercise: FileQuestion,
};

const typeColors = {
  video: 'bg-blue-100 text-blue-700',
  audio: 'bg-purple-100 text-purple-700',
  exercise: 'bg-orange-100 text-orange-700',
};

export function LessonCard({ lesson }: LessonCardProps) {
  const Icon = typeIcons[lesson.type];
  const typeColor = typeColors[lesson.type];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{lesson.title}</CardTitle>
            <CardDescription className="line-clamp-2">{lesson.description}</CardDescription>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${typeColor} flex items-center gap-1`}>
            <Icon className="w-3 h-3" />
            {lesson.type}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{lesson.completion_count || 0} completed</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(lesson.created_at), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          Edit
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          View
        </Button>
      </CardFooter>
    </Card>
  );
}
