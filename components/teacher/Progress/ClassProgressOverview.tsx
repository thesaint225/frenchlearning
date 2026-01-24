import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/teacher/StatsCard';
import { TrendingUp, Users, CheckCircle2, Clock, ClipboardList } from 'lucide-react';
import { ClassAnalytics } from '@/lib/types';

interface ClassProgressOverviewProps {
  analytics: ClassAnalytics;
}

export function ClassProgressOverview({ analytics }: ClassProgressOverviewProps) {
  const { completion_rates, average_scores } = analytics;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Lesson Completion"
        value={`${completion_rates.lessons}%`}
        icon={CheckCircle2}
        description="Average completion rate"
      />
      <StatsCard
        title="Assignment Completion"
        value={`${completion_rates.assignments}%`}
        icon={ClipboardList}
        description="Submissions received"
      />
      <StatsCard
        title="Average Score"
        value={`${average_scores.overall}%`}
        icon={TrendingUp}
        description="Class average"
      />
      <StatsCard
        title="On-Time Submissions"
        value={`${completion_rates.on_time_submissions}%`}
        icon={Clock}
        description="Submitted before deadline"
      />
    </div>
  );
}
