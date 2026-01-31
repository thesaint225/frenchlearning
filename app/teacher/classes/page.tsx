'use client';

import { useState } from 'react';
import { ClassCard } from '@/components/teacher/Classes/ClassCard';
import { CreateClassDialog } from '@/components/teacher/Classes/CreateClassDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ListSkeleton } from '@/components/skeletons/ListSkeleton';
import { Class } from '@/lib/types';
import { createClass } from '@/lib/services/classes';
import { useTeacherLayout } from '@/lib/contexts/TeacherLayoutContext';

export default function ClassesPage() {
  const {
    teacherId,
    teacherLoading: authLoading,
    teacherError: authError,
    classes,
    classesLoading: isLoading,
    setClasses,
  } = useTeacherLayout();
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateClass = async (
    classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>,
  ) => {
    if (!teacherId) return;
    setError(null);
    const { data: newClass, error: createError } = await createClass(
      teacherId,
      {
        name: classData.name,
        description: classData.description,
        class_code: classData.class_code,
        settings: classData.settings,
      },
    );
    if (createError) {
      setError(createError.message);
      throw createError;
    }
    if (newClass) {
      setClasses((prev) => [newClass, ...prev]);
    }
  };

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold text-[#1f1f1f] mb-2'>My Classes</h2>
          <p className='text-muted-foreground'>
            Manage your classes, students, and course content
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          disabled={!teacherId}
        >
          <Plus className='w-4 h-4 mr-2' />
          Create Class
        </Button>
      </div>

      {(authError || error) && (
        <div className='rounded-md bg-red-50 p-3 text-sm text-red-700'>
          {authError || error}
        </div>
      )}

      {authError || !teacherId ? (
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>
            {authError || 'Please sign in as a teacher to view this page.'}
          </p>
        </div>
      ) : authLoading || isLoading ? (
        <ListSkeleton count={6} showTitle showFilters={false} />
      ) : classes.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-muted-foreground mb-4'>
            You don&apos;t have any classes yet.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className='w-4 h-4 mr-2' />
            Create Your First Class
          </Button>
        </div>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {classes.map((classItem) => (
            <ClassCard key={classItem.id} class={classItem} />
          ))}
        </div>
      )}

      <CreateClassDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateClass={handleCreateClass}
      />
    </div>
  );
}
