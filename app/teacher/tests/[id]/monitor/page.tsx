'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestMonitorCard } from '@/components/teacher/TestMonitorCard';
import { getTestById, getTestAttemptsByTest, mockStudents } from '@/lib/mock-data';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TestAttempt, TestAttemptStatus } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TestMonitorPage() {
  const params = useParams();
  const testId = params.id as string;
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // In a real app, fetch test and attempts from API
  const test = getTestById(testId);
  const allAttempts = getTestAttemptsByTest(testId);

  // Create attempts for students who haven't started yet
  const enrolledStudentIds = mockStudents.map(s => s.id);
  const existingStudentIds = allAttempts.map(a => a.student_id);
  const notStartedStudents = enrolledStudentIds
    .filter(id => !existingStudentIds.includes(id))
    .map(id => ({
      id: `not-started-${id}`,
      test_id: testId,
      student_id: id,
      student: mockStudents.find(s => s.id === id),
      started_at: new Date().toISOString(),
      max_score: test?.max_points || 0,
      status: 'not_started' as TestAttemptStatus,
      answers: {},
    }));

  const allStudentAttempts: TestAttempt[] = [...allAttempts, ...notStartedStudents];

  const filteredAttempts = allStudentAttempts.filter((attempt) => {
    if (statusFilter === 'all') return true;
    return attempt.status === statusFilter;
  });

  const stats = {
    total: allStudentAttempts.length,
    notStarted: allStudentAttempts.filter(a => a.status === 'not_started').length,
    inProgress: allStudentAttempts.filter(a => a.status === 'in_progress').length,
    submitted: allStudentAttempts.filter(a => a.status === 'submitted').length,
    graded: allStudentAttempts.filter(a => a.status === 'graded').length,
  };

  if (!test) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Test not found</p>
        <Link href="/teacher/tests">
          <Button>Back to Tests</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/teacher/tests/${testId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Monitor Test</h2>
          <p className="text-muted-foreground">{test.title}</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Students</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.notStarted}</div>
            <div className="text-sm text-muted-foreground">Not Started</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.submitted}</div>
            <div className="text-sm text-muted-foreground">Submitted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.graded}</div>
            <div className="text-sm text-muted-foreground">Graded</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Attempts</CardTitle>
              <CardDescription>Monitor student progress during the test</CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" sideOffset={2}>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAttempts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No attempts match the selected filter
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAttempts.map((attempt) => (
                <TestMonitorCard
                  key={attempt.id}
                  attempt={attempt}
                  timeLimitMinutes={test.time_limit_minutes}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
