import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassAnalytics } from '@/lib/types';
import { Users, Clock, TrendingUp } from 'lucide-react';

interface EngagementMetricsProps {
  analytics: ClassAnalytics;
}

export function EngagementMetrics({ analytics }: EngagementMetricsProps) {
  const { engagement_metrics } = analytics;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily Active Users</CardTitle>
          <CardDescription>Students active today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{engagement_metrics.daily_active_users}</div>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>out of {analytics.student_progress.length} enrolled</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Active Users</CardTitle>
          <CardDescription>Students active this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{engagement_metrics.weekly_active_users}</div>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>
              {Math.round(
                (engagement_metrics.weekly_active_users / analytics.student_progress.length) * 100
              )}
              % of class
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Avg Session Length</CardTitle>
          <CardDescription>Average time per session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{engagement_metrics.average_session_length}</div>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>minutes</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
