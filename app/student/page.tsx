'use client';

import { useMemo } from 'react';
import { StatsCard } from '@/components/teacher/StatsCard';
import { Assignment, Submission } from '@/lib/types';
import { ClipboardList, BookOpen, TrendingUp, Calendar, UserPlus, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useStudentLayout } from '@/lib/contexts/StudentLayoutContext';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { format, formatDistanceToNow } from 'date-fns';

export default function StudentDashboard() {
  const {
    studentId,
    studentLoading,
    assignments,
    submissions,
    classes,
    shellLoading,
    studentError,
  } = useStudentLayout();

  // Create a map of assignment ID to submission
  const submissionMap = useMemo(() => {
    const map = new Map<string, Submission>();
    submissions.forEach((submission) => {
      map.set(submission.assignment_id, submission);
    });
    return map;
  }, [submissions]);

  // Calculate dashboard stats
  const stats = useMemo(() => {
    const activeAssignments = assignments.filter(a => a.status === 'published').length;
    
    // Calculate upcoming due dates (next 7 days)
    const now = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    const upcomingDueDates = assignments.filter(a => {
      const dueDate = new Date(a.due_date);
      return dueDate >= now && dueDate <= weekFromNow && a.status === 'published';
    }).length;

    // Calculate lessons completed (from submissions)
    // This is a simplified calculation - in a real app, you'd track lesson progress separately
    const lessonsCompleted = submissions.filter(s => s.status === 'graded').length;

    // Calculate average score from graded submissions
    const gradedSubmissions = submissions.filter(s => s.status === 'graded' && s.score !== undefined);
    const averageScore = gradedSubmissions.length > 0
      ? Math.round(
          gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubmissions.length
        )
      : 0;

    return {
      activeAssignments,
      upcomingDueDates,
      lessonsCompleted,
      averageScore,
    };
  }, [assignments, submissions]);

  // Get recent activity
  const recentActivity = useMemo(() => {
    const activities: Array<{
      type: 'graded' | 'upcoming' | 'submitted';
      title: string;
      time: string;
      assignment?: Assignment;
      submission?: Submission;
    }> = [];

    // Recent graded submissions (last 3)
    const gradedSubmissions = submissions
      .filter(s => s.status === 'graded' && s.graded_at)
      .sort((a, b) => new Date(b.graded_at!).getTime() - new Date(a.graded_at!).getTime())
      .slice(0, 3);

    gradedSubmissions.forEach(submission => {
      const assignment = assignments.find(a => a.id === submission.assignment_id);
      if (assignment) {
        activities.push({
          type: 'graded',
          title: `${assignment.title} graded`,
          time: formatDistanceToNow(new Date(submission.graded_at!), { addSuffix: true }),
          assignment,
          submission,
        });
      }
    });

    // Upcoming assignments (next 3)
    const now = new Date();
    const upcoming = assignments
      .filter(a => {
        const dueDate = new Date(a.due_date);
        return dueDate >= now && a.status === 'published';
      })
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      .slice(0, 3);

    upcoming.forEach(assignment => {
      activities.push({
        type: 'upcoming',
        title: `${assignment.title} due ${formatDistanceToNow(new Date(assignment.due_date), { addSuffix: true })}`,
        time: format(new Date(assignment.due_date), 'MMM d, yyyy'),
        assignment,
      });
    });

    // Sort by time (most recent first)
    return activities.sort((a, b) => {
      const timeA = a.submission?.graded_at || a.assignment?.due_date || '';
      const timeB = b.submission?.graded_at || b.assignment?.due_date || '';
      return new Date(timeB).getTime() - new Date(timeA).getTime();
    }).slice(0, 5);
  }, [assignments, submissions]);

  const isLoading = studentLoading || (studentId != null && shellLoading);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!studentId) {
    return null;
  }

  if (studentError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{studentError}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here's your learning progress.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your classes
          </CardTitle>
          <CardDescription>
            {classes.length > 0
              ? 'Classes you are enrolled in'
              : "You're not in any class yet. Join one with a code from your teacher."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {classes.length > 0 ? (
            <ul className="space-y-2">
              {classes.map((c) => (
                <li key={c.id} className="flex items-baseline justify-between gap-2 py-1">
                  <span className="font-medium text-[#1f1f1f]">{c.name}</span>
                  <span className="text-sm text-muted-foreground font-mono">{c.class_code}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Link href="/student/classes/join">
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Join class
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Assignments"
          value={stats.activeAssignments}
          icon={ClipboardList}
          description="Assignments available to complete"
        />
        <StatsCard
          title="Lessons Completed"
          value={stats.lessonsCompleted}
          icon={BookOpen}
          description="Lessons you've finished"
        />
        <StatsCard
          title="Average Score"
          value={stats.averageScore > 0 ? `${stats.averageScore}%` : 'N/A'}
          icon={TrendingUp}
          description="Your average grade"
        />
        <StatsCard
          title="Upcoming Due Dates"
          value={stats.upcomingDueDates}
          icon={Calendar}
          description="Due in the next 7 days"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/student/classes/join" className="block">
              <Button className="w-full justify-start px-6 py-4 rounded-md" variant="default">
                <UserPlus className="mr-3 h-4 w-4" />
                Join class
              </Button>
            </Link>
            <Link href="/student/assignments" className="block">
              <Button className="w-full justify-start px-6 py-4 rounded-md" variant="default">
                <ClipboardList className="mr-3 h-4 w-4" />
                View Assignments
              </Button>
            </Link>
            <Link href="/student/lessons" className="block">
              <Button className="w-full justify-start px-6 py-4 rounded-md" variant="default">
                <BookOpen className="mr-3 h-4 w-4" />
                Continue Learning
              </Button>
            </Link>
            <Link href="/student/progress" className="block">
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Progress
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        activity.type === 'graded'
                          ? 'bg-primary'
                          : activity.type === 'upcoming'
                          ? 'bg-accent'
                          : 'bg-green-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      {activity.submission && activity.submission.score !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          Score: {activity.submission.score} / {activity.submission.max_score}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
