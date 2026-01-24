'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/teacher/StatsCard';
import {
  Users,
  ClipboardList,
  BookOpen,
  BarChart3,
  MessageSquare,
  Settings,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { getClassById, getEnrollmentsByClass, getAnnouncementsByClass } from '@/lib/mock-data';
import { format } from 'date-fns';

export default function ClassOverviewPage() {
  const params = useParams();
  const classId = params.classId as string;
  const classData = getClassById(classId);
  const enrollments = getEnrollmentsByClass(classId);
  const announcements = getAnnouncementsByClass(classId);

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

  const stats = {
    total_students: enrollments.length,
    active_assignments: classData.active_assignments_count || 0,
    announcements: announcements.length,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/teacher/classes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">{classData.name}</h2>
          <p className="text-muted-foreground">{classData.description || 'No description'}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Students"
          value={stats.total_students}
          icon={Users}
          description="Enrolled students"
        />
        <StatsCard
          title="Active Assignments"
          value={stats.active_assignments}
          icon={ClipboardList}
          description="Currently published"
        />
        <StatsCard
          title="Announcements"
          value={stats.announcements}
          icon={MessageSquare}
          description="Total posted"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Student Roster</CardTitle>
            <CardDescription>Manage your class students</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/teacher/classes/${classId}/students`}>
              <Button className="w-full" variant="outline">
                View Students
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress Tracking</CardTitle>
            <CardDescription>Monitor student progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/teacher/classes/${classId}/progress`}>
              <Button className="w-full" variant="outline">
                View Progress
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Communicate with your class</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/teacher/classes/${classId}/announcements`}>
              <Button className="w-full" variant="outline">
                Manage Announcements
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>View class performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/teacher/classes/${classId}/analytics`}>
              <Button className="w-full" variant="outline">
                View Analytics
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Class Settings</CardTitle>
            <CardDescription>Configure class preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/teacher/classes/${classId}/settings`}>
              <Button className="w-full" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Announcements */}
      {announcements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{announcement.title}</h4>
                    {announcement.is_pinned && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Pinned
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {announcement.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(announcement.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              ))}
            </div>
            <Link href={`/teacher/classes/${classId}/announcements`}>
              <Button variant="ghost" className="w-full mt-4">
                View All Announcements
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
