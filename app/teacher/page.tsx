'use client';

import { StatsCard } from '@/components/teacher/StatsCard';
import { mockDashboardStats } from '@/lib/mock-data';
import {
  Users,
  ClipboardList,
  CheckSquare,
  BookOpen,
  FileText,
  GraduationCap,
} from 'lucide-react';
import { MyClassesCardSkeleton } from '@/components/skeletons/MyClassesCardSkeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTeacherLayout } from '@/lib/contexts/TeacherLayoutContext';

export default function TeacherDashboard() {
  const stats = mockDashboardStats;
  const {
    teacherLoading: authLoading,
    classesLoading,
    classes,
  } = useTeacherLayout();

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-[#1f1f1f] mb-2'>
          Dashboard Overview
        </h2>
        <p className='text-muted-foreground'>
          Welcome back! Here&apos;s what&apos;s happening with your classes.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
        <StatsCard
          title='Total Students'
          value={stats.total_students}
          icon={Users}
          description='Active students in your classes'
        />
        <StatsCard
          title='Active Assignments'
          value={stats.active_assignments}
          icon={ClipboardList}
          description='Currently published assignments'
        />
        <StatsCard
          title='Active Tests'
          value={stats.active_tests || 0}
          icon={FileText}
          description='Currently active tests'
        />
        <StatsCard
          title='Pending Grades'
          value={stats.pending_grades}
          icon={CheckSquare}
          description='Submissions awaiting review'
        />
        <StatsCard
          title='Lessons Uploaded'
          value={stats.lessons_uploaded}
          icon={BookOpen}
          description='Total lessons in your library'
        />
      </div>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <div>
            <CardTitle>My Classes</CardTitle>
            <CardDescription>Your classes and course sections</CardDescription>
          </div>
          <Link href='/teacher/classes'>
            <Button variant='outline' size='sm'>
              Manage classes
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {authLoading || classesLoading ? (
            <MyClassesCardSkeleton />
          ) : classes.length === 0 ? (
            <p className='text-sm text-muted-foreground py-2'>
              You don&apos;t have any classes yet.{' '}
              <Link href='/teacher/classes' className='text-primary underline'>
                Create your first class
              </Link>
            </p>
          ) : (
            <ul className='space-y-2'>
              {classes.slice(0, 5).map((c) => (
                <li key={c.id} className='flex items-center gap-2 text-sm'>
                  <GraduationCap className='h-4 w-4 text-muted-foreground shrink-0' />
                  <Link
                    href={`/teacher/classes/${c.id}`}
                    className='text-primary hover:underline truncate'
                  >
                    {c.name}
                  </Link>
                  {c.class_code && (
                    <span className='text-muted-foreground text-xs shrink-0'>
                      ({c.class_code})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {!classesLoading && classes.length > 5 && (
            <Link
              href='/teacher/classes'
              className='inline-block mt-2 text-sm text-primary hover:underline'
            >
              View all {classes.length} classes
            </Link>
          )}
        </CardContent>
      </Card>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Link href='/teacher/lessons/upload' className='block'>
              <Button
                className='w-full justify-start px-6 py-4 rounded-md'
                variant='default'
              >
                <BookOpen className='mr-3 h-4 w-4' />
                Upload New Lesson
              </Button>
            </Link>
            <Link href='/teacher/assignments/create' className='block'>
              <Button
                className='w-full justify-start px-6 py-4 rounded-md'
                variant='default'
              >
                <ClipboardList className='mr-3 h-4 w-4' />
                Create Assignment
              </Button>
            </Link>
            <Link href='/teacher/tests/create' className='block'>
              <Button
                className='w-full justify-start px-6 py-4 rounded-md'
                variant='default'
              >
                <FileText className='mr-3 h-4 w-4' />
                Create Test
              </Button>
            </Link>
            <Link href='/teacher/grading' className='block'>
              <Button className='w-full justify-start' variant='outline'>
                <CheckSquare className='mr-2 h-4 w-4' />
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
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='h-2 w-2 rounded-full bg-primary' />
                <div className='flex-1'>
                  <p className='text-sm font-medium'>
                    5 new submissions to grade
                  </p>
                  <p className='text-xs text-muted-foreground'>2 hours ago</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='h-2 w-2 rounded-full bg-accent' />
                <div className='flex-1'>
                  <p className='text-sm font-medium'>
                    Assignment "Week 1" due tomorrow
                  </p>
                  <p className='text-xs text-muted-foreground'>5 hours ago</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='h-2 w-2 rounded-full bg-primary' />
                <div className='flex-1'>
                  <p className='text-sm font-medium'>New lesson uploaded</p>
                  <p className='text-xs text-muted-foreground'>1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
