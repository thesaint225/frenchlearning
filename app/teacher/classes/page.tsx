'use client';

import { useState } from 'react';
import { ClassCard } from '@/components/teacher/Classes/ClassCard';
import { CreateClassDialog } from '@/components/teacher/Classes/CreateClassDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Class } from '@/lib/types';
import { getClassesByTeacher, mockClasses } from '@/lib/mock-data';

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>(getClassesByTeacher('teacher1'));
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateClass = (classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>) => {
    // In a real app, this would be an API call
    const newClass: Class = {
      ...classData,
      id: `class${Date.now()}`,
      created_at: new Date().toISOString(),
      student_count: 0,
      active_assignments_count: 0,
    };
    setClasses([...classes, newClass]);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">My Classes</h2>
          <p className="text-muted-foreground">
            Manage your classes, students, and course content
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Class
        </Button>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You don't have any classes yet.</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Class
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
