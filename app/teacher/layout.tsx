'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/teacher/Navigation';
import { ClassSelector } from '@/components/teacher/Classes/ClassSelector';
import { getClassesByTeacher } from '@/lib/services/classes';
import { PLACEHOLDER_TEACHER_ID } from '@/lib/constants';
import { usePathname } from 'next/navigation';
import { Class } from '@/lib/types';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    getClassesByTeacher(PLACEHOLDER_TEACHER_ID).then(({ data }) => {
      setClasses(data ?? []);
    });
  }, []);
  
  // Extract classId from path if on a class page
  const classMatch = pathname.match(/\/teacher\/classes\/([^/]+)/);
  const currentClassId = classMatch ? classMatch[1] : undefined;
  
  const showClassSelector = pathname.startsWith('/teacher/classes');

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#1f1f1f]">Learn French</h1>
            <div className="flex items-center gap-4">
              {showClassSelector && classes.length > 0 && (
                <ClassSelector
                  classes={classes}
                  currentClassId={currentClassId}
                />
              )}
              <div className="text-sm text-muted-foreground">Teacher Dashboard</div>
            </div>
          </div>
        </div>
        <Navigation />
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
