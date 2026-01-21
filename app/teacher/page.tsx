'use client';

import { StatsCard } from '@/components/teacher/StatsCard';
import { mockDashboardStats } from '@/lib/mock-data';
import { Users, ClipboardList, CheckSquare, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TeacherDashboard() {
  const stats = mockDashboardStats;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your classes.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={stats.total_students}
          icon={Users}
          description="Active students in your classes"
        />
        <StatsCard
          title="Active Assignments"
          value={stats.active_assignments}
          icon={ClipboardList}
          description="Currently published assignments"
        />
        <StatsCard
          title="Pending Grades"
          value={stats.pending_grades}
          icon={CheckSquare}
          description="Submissions awaiting review"
        />
        <StatsCard
          title="Lessons Uploaded"
          value={stats.lessons_uploaded}
          icon={BookOpen}
          description="Total lessons in your library"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/teacher/lessons/upload">
              <Button className="w-full justify-start" variant="default">
                <BookOpen className="mr-2 h-4 w-4" />
                Upload New Lesson
              </Button>
            </Link>
            <Link href="/teacher/assignments/create">
              <Button className="w-full justify-start" variant="default">
                <ClipboardList className="mr-2 h-4 w-4" />
                Create Assignment
              </Button>
            </Link>
            <Link href="/teacher/grading">
              <Button className="w-full justify-start" variant="outline">
                <CheckSquare className="mr-2 h-4 w-4" />
                Grade Submissions
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
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">5 new submissions to grade</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Assignment "Week 1" due tomorrow</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New lesson uploaded</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
