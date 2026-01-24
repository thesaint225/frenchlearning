import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassAnalytics } from '@/lib/types';
import { TrendingUp, ClipboardList, FileText } from 'lucide-react';

interface ScoreAnalyticsProps {
  analytics: ClassAnalytics;
}

export function ScoreAnalytics({ analytics }: ScoreAnalyticsProps) {
  const { average_scores } = analytics;

  const scores = [
    {
      label: 'Overall Average',
      value: average_scores.overall,
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      label: 'Assignments',
      value: average_scores.assignments,
      icon: ClipboardList,
      color: 'text-green-600',
    },
    {
      label: 'Tests',
      value: average_scores.tests,
      icon: FileText,
      color: 'text-purple-600',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Scores</CardTitle>
        <CardDescription>Performance across different assessment types</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {scores.map((score) => {
            const Icon = score.icon;
            return (
              <div key={score.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${score.color}`} />
                    <span className="font-medium">{score.label}</span>
                  </div>
                  <span className={`text-2xl font-bold ${score.color}`}>
                    {score.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all flex items-center justify-end pr-2 ${
                      score.label === 'Overall Average'
                        ? 'bg-blue-500'
                        : score.label === 'Assignments'
                        ? 'bg-green-500'
                        : 'bg-purple-500'
                    }`}
                    style={{ width: `${score.value}%` }}
                  >
                    {score.value >= 70 && (
                      <span className="text-xs text-white font-semibold">
                        {score.value >= 90 ? 'Excellent' : score.value >= 80 ? 'Good' : 'Fair'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
