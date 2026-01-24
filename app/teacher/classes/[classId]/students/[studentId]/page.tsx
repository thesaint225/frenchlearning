'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Mail, Calendar, TrendingUp, BookOpen, ClipboardList, FileText } from 'lucide-react';
import { getStudentById, getSubmissionsByAssignment, getTestAttemptsByTest, mockAssignments, mockTests } from '@/lib/mock-data';
import { format } from 'date-fns';

export default function StudentProfilePage() {
  const params = useParams();
  const classId = params.classId as string;
  const studentId = params.studentId as string;
  const student = getStudentById(studentId);

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Student not found</p>
        <Link href={`/teacher/classes/${classId}/students`}>
          <Button variant="outline" className="mt-4">
            Back to Students
          </Button>
        </Link>
      </div>
    );
  }

  const progress = student.progress;
  const submissions = getSubmissionsByAssignment('1'); // In real app, get all submissions for this student
  const testAttempts = getTestAttemptsByTest('1'); // In real app, get all test attempts for this student

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/teacher/classes/${classId}/students`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Student Profile</h2>
          <p className="text-muted-foreground">{student.name}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{student.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{student.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {progress && (
          <Card>
            <CardHeader>
              <CardTitle>Progress Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Lessons Completed</span>
                  <span className="font-semibold">
                    {progress.lessons_completed}/{progress.total_lessons}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full"
                    style={{
                      width: `${(progress.lessons_completed / progress.total_lessons) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Average Score:</span>
                <span className="font-semibold">{progress.average_score}%</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest submissions and test attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions.slice(0, 5).map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{submission.assignment?.title || 'Assignment'}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(submission.submitted_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {submission.score !== undefined && (
                    <p className="font-semibold">
                      {submission.score}/{submission.max_score}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground capitalize">{submission.status}</p>
                </div>
              </div>
            ))}
            {submissions.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No submissions yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
