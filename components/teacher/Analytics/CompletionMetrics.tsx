import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassAnalytics } from '@/lib/types';
import { CheckCircle2, ClipboardList, FileText, Clock } from 'lucide-react';

interface CompletionMetricsProps {
  analytics: ClassAnalytics;
}

export function CompletionMetrics({ analytics }: CompletionMetricsProps) {
  const { completion_rates } = analytics;

  const metrics = [
    {
      label: 'Lessons',
      value: completion_rates.lessons,
      icon: CheckCircle2,
      color: 'bg-blue-500',
    },
    {
      label: 'Assignments',
      value: completion_rates.assignments,
      icon: ClipboardList,
      color: 'bg-green-500',
    },
    {
      label: 'Tests',
      value: completion_rates.tests,
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      label: 'On-Time',
      value: completion_rates.on_time_submissions,
      icon: Clock,
      color: 'bg-orange-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completion Rates</CardTitle>
        <CardDescription>Overall class completion metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{metric.label}</span>
                  </div>
                  <span className="font-semibold">{metric.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${metric.color} h-3 rounded-full transition-all`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
