'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EngagementMetrics } from '@/components/teacher/Analytics/EngagementMetrics';
import { CompletionMetrics } from '@/components/teacher/Analytics/CompletionMetrics';
import { ScoreAnalytics } from '@/components/teacher/Analytics/ScoreAnalytics';
import { ContentPerformance } from '@/components/teacher/Analytics/ContentPerformance';
import { ArrowLeft, Download } from 'lucide-react';
import { getClassById, getClassAnalyticsByClass, getEnrollmentsByClass } from '@/lib/mock-data';

export default function AnalyticsPage() {
  const params = useParams();
  const classId = params.classId as string;
  const classData = getClassById(classId);
  const analytics = getClassAnalyticsByClass(classId);

  if (!classData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Class not found</p>
        <Link href="/teacher/classes">
          <Button variant="outline" className="mt-4">
            Back to Classes
          </Button>
        </Link>
      </div>
    );
  }

  // Generate basic analytics if none exist
  const displayAnalytics = analytics || (() => {
    const enrollments = getEnrollmentsByClass(classId);
    const students = enrollments.map(e => e.student).filter(Boolean);
    
    if (students.length === 0) {
      return null;
    }

    // Return minimal analytics structure
    return {
      class_id: classId,
      completion_rates: {
        lessons: 0,
        assignments: 0,
        tests: 0,
        on_time_submissions: 0,
      },
      average_scores: {
        overall: 0,
        assignments: 0,
        tests: 0,
      },
      engagement_metrics: {
        daily_active_users: 0,
        weekly_active_users: 0,
        average_session_length: 0,
        login_frequency: 0,
      },
      student_progress: students.map((s) => ({
        student_id: s?.id || '',
        student: s,
        lessons_completed: 0,
        total_lessons: 20,
        assignment_completion_rate: 0,
        average_score: 0,
      })),
      content_performance: [],
    };
  })();

  if (!displayAnalytics) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href={`/teacher/classes/${classId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Analytics Dashboard</h2>
            <p className="text-muted-foreground">{classData.name}</p>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No students enrolled yet. Analytics will appear once students join and start completing work.</p>
          <Link href={`/teacher/classes/${classId}/students`}>
            <Button variant="outline">
              Add Students
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    // In a real app, this would export analytics data
    alert('Export functionality would generate a CSV/PDF report here');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/teacher/classes/${classId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Analytics Dashboard</h2>
            <p className="text-muted-foreground">{classData.name}</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Engagement Metrics</h3>
        <EngagementMetrics analytics={displayAnalytics} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CompletionMetrics analytics={displayAnalytics} />
        <ScoreAnalytics analytics={displayAnalytics} />
      </div>

      {displayAnalytics.content_performance.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Content Performance</h3>
          <ContentPerformance analytics={displayAnalytics} />
        </div>
      )}
    </div>
  );
}
