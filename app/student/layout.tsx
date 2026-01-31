'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/student/Navigation';
import { useStudentId } from '@/lib/hooks/useStudentId';
import { getAssignmentsByStudent } from '@/lib/services/assignments';
import { getSubmissionsByStudent } from '@/lib/services/submissions';
import { getClassesByStudent } from '@/lib/services/classes';
import { StudentLayoutProvider } from '@/lib/contexts/StudentLayoutContext';
import type { Assignment, Submission, Class } from '@/lib/types';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { studentId, loading: studentLoading, error: studentError } =
    useStudentId();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [shellLoading, setShellLoading] = useState(false);

  const refetchShell = useCallback(async () => {
    if (!studentId) return;
    setShellLoading(true);
    const [assignmentsResult, submissionsResult, classesResult] =
      await Promise.all([
        getAssignmentsByStudent(studentId),
        getSubmissionsByStudent(studentId),
        getClassesByStudent(studentId),
      ]);
    if (assignmentsResult.data) setAssignments(assignmentsResult.data);
    if (submissionsResult.data) setSubmissions(submissionsResult.data);
    if (classesResult.data) setClasses(classesResult.data);
    setShellLoading(false);
  }, [studentId]);

  const refetchSubmissionsOnly = useCallback(async () => {
    if (!studentId) return;
    const { data } = await getSubmissionsByStudent(studentId);
    if (data) setSubmissions(data);
  }, [studentId]);

  const refetchClassesOnly = useCallback(async () => {
    if (!studentId) return;
    const { data } = await getClassesByStudent(studentId);
    if (data) setClasses(data);
  }, [studentId]);

  useEffect(() => {
    if (!studentId) {
      setAssignments([]);
      setSubmissions([]);
      setClasses([]);
      setShellLoading(false);
      return;
    }
    let cancelled = false;
    setShellLoading(true);
    Promise.all([
      getAssignmentsByStudent(studentId),
      getSubmissionsByStudent(studentId),
      getClassesByStudent(studentId),
    ]).then(
      ([assignmentsResult, submissionsResult, classesResult]) => {
        if (cancelled) return;
        if (assignmentsResult.data) setAssignments(assignmentsResult.data);
        if (submissionsResult.data) setSubmissions(submissionsResult.data);
        if (classesResult.data) setClasses(classesResult.data);
        setShellLoading(false);
      },
      () => {
        if (!cancelled) setShellLoading(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [studentId]);

  useEffect(() => {
    if (!studentLoading && !studentId) {
      router.replace('/auth/signin');
    }
  }, [studentLoading, studentId, router]);

  return (
    <StudentLayoutProvider
      value={{
        studentId,
        studentLoading,
        studentError,
        assignments,
        submissions,
        classes,
        shellLoading,
        refetchShell,
        refetchSubmissionsOnly,
        refetchClassesOnly,
      }}
    >
      <div className="min-h-screen bg-[#f7f7f5]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[#1f1f1f]">Learn French</h1>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Student Dashboard
                </div>
              </div>
            </div>
          </div>
          <Navigation />
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </StudentLayoutProvider>
  );
}
