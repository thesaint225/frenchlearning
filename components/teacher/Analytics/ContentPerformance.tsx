import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassAnalytics } from '@/lib/types';
import { BookOpen, TrendingUp, TrendingDown } from 'lucide-react';

interface ContentPerformanceProps {
  analytics: ClassAnalytics;
}

export function ContentPerformance({ analytics }: ContentPerformanceProps) {
  const { content_performance } = analytics;

  // Sort by completion count
  const sortedContent = [...content_performance].sort(
    (a, b) => b.completion_count - a.completion_count
  );

  const topContent = sortedContent.slice(0, 5);
  const bottomContent = sortedContent.slice(-3).reverse();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Most Completed Lessons
          </CardTitle>
          <CardDescription>Top performing content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topContent.map((lesson, index) => (
              <div key={lesson.lesson_id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-muted-foreground">
                      #{index + 1}
                    </span>
                    <span className="font-medium text-sm">{lesson.lesson_title}</span>
                  </div>
                  <span className="text-sm font-semibold">{lesson.completion_count} students</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Avg Score: {lesson.average_score}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-orange-600" />
            Least Completed Lessons
          </CardTitle>
          <CardDescription>May need attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bottomContent.map((lesson, index) => (
              <div key={lesson.lesson_id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-muted-foreground">
                      #{sortedContent.length - index}
                    </span>
                    <span className="font-medium text-sm">{lesson.lesson_title}</span>
                  </div>
                  <span className="text-sm font-semibold">{lesson.completion_count} students</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Avg Score: {lesson.average_score}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
