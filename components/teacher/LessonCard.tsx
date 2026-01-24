import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lesson } from '@/lib/types';
import { Video, Music, FileQuestion, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LessonCardProps {
  lesson: Lesson;
}

/**
 * Maps lesson types to their corresponding icon components.
 */
const typeIcons = {
  video: Video,
  audio: Music,
  exercise: FileQuestion,
} as const;

/**
 * Maps lesson types to their corresponding Tailwind CSS color classes.
 */
const typeColors = {
  video: 'bg-blue-100 text-blue-700',
  audio: 'bg-purple-100 text-purple-700',
  exercise: 'bg-orange-100 text-orange-700',
} as const;

/**
 * Displays a lesson card with title, description, type badge, completion stats, and action buttons.
 * 
 * @param props - Component props
 * @param props.lesson - The lesson object to display
 * @returns A card component displaying lesson information
 */
export const LessonCard = ({ lesson }: LessonCardProps) => {
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
          <div className={cn('px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1', typeColor)}>
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
        <Link href={`/teacher/lessons/${lesson.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            View
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
