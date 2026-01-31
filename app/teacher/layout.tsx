'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navigation } from '@/components/teacher/Navigation';
import { ClassSelector } from '@/components/teacher/Classes/ClassSelector';
import { getClassesByTeacher } from '@/lib/services/classes';
import { useTeacherId } from '@/lib/hooks/useTeacherId';
import { usePathname } from 'next/navigation';
import { Class } from '@/lib/types';
import { TeacherLayoutProvider } from '@/lib/contexts/TeacherLayoutContext';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { teacherId, loading: teacherLoading, error: teacherError } =
    useTeacherId();
  const [classes, setClasses] = useState<Class[]>([]);
  const [classesLoading, setClassesLoading] = useState(false);

  const refetchClasses = useCallback(async () => {
    if (!teacherId) return;
    setClassesLoading(true);
    const { data } = await getClassesByTeacher(teacherId);
    setClasses(data ?? []);
    setClassesLoading(false);
  }, [teacherId]);

  useEffect(() => {
    if (!teacherId) {
      setClasses([]);
      setClassesLoading(false);
      return;
    }
    let cancelled = false;
    setClassesLoading(true);
    getClassesByTeacher(teacherId).then(({ data }) => {
      if (!cancelled) {
        setClasses(data ?? []);
        setClassesLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [teacherId]);

  // Extract classId from path if on a class page
  const classMatch = pathname.match(/\/teacher\/classes\/([^/]+)/);
  const currentClassId = classMatch ? classMatch[1] : undefined;

  const showClassSelector = pathname.startsWith('/teacher/classes');

  return (
    <TeacherLayoutProvider
      value={{
        teacherId,
        teacherLoading,
        teacherError,
        classes,
        classesLoading,
        setClasses,
        refetchClasses,
      }}
    >
      <div className='min-h-screen bg-[#f7f7f5]'>
        <header className='bg-white border-b border-gray-200 sticky top-0 z-50'>
          <div className='container mx-auto px-4 py-4'>
            <div className='flex items-center justify-between'>
              <h1 className='text-2xl font-bold text-[#1f1f1f]'>Learn French</h1>
              <div className='flex items-center gap-4'>
                {showClassSelector && classes.length > 0 && (
                  <ClassSelector
                    classes={classes}
                    currentClassId={currentClassId}
                  />
                )}
                <div className='text-sm text-muted-foreground'>
                  Teacher Dashboard
                </div>
              </div>
            </div>
          </div>
          <Navigation />
        </header>
        <main className='container mx-auto px-4 py-8'>{children}</main>
      </div>
    </TeacherLayoutProvider>
  );
}
