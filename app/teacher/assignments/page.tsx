'use client';

import { useState, useMemo, useEffect } from 'react';
import { AssignmentCard } from '@/components/teacher/AssignmentCard';
import { Assignment, AssignmentStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ListSkeleton } from '@/components/skeletons/ListSkeleton';
import Link from 'next/link';
import {
  getAssignmentsByTeacher,
  deleteAssignment,
} from '@/lib/services/assignments';
import { useTeacherLayout } from '@/lib/contexts/TeacherLayoutContext';

export default function AssignmentsPage() {
  const {
    teacherId,
    teacherLoading: authLoading,
    teacherError: authError,
    classes,
  } = useTeacherLayout();
  const [filterStatus, setFilterStatus] = useState<AssignmentStatus | 'all'>(
    'all',
  );
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const classIdToName = useMemo(
    () => Object.fromEntries(classes.map((c) => [c.id, c.name])),
    [classes],
  );

  // Fetch assignments only (classes from layout context)
  useEffect(() => {
    if (!teacherId) {
      setAssignments([]);
      setIsLoading(false);
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const assignmentsResult = await getAssignmentsByTeacher(teacherId);
      if (assignmentsResult.error || !assignmentsResult.data) {
        setError(
          assignmentsResult.error?.message || 'Failed to load assignments',
        );
      } else {
        setAssignments(assignmentsResult.data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [teacherId]);

  const filteredAssignments = useMemo(() => {
    if (filterStatus === 'all') return assignments;
    return assignments.filter(
      (assignment) => assignment.status === filterStatus,
    );
  }, [assignments, filterStatus]);

  const handleDeleteAssignment = async (assignmentId: string) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    const assignmentTitle = assignment?.title || 'this assignment';

    if (
      !confirm(
        `Are you sure you want to delete "${assignmentTitle}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    const { success, error } = await deleteAssignment(assignmentId);

    if (success) {
      setAssignments(assignments.filter((a) => a.id !== assignmentId));
    } else {
      alert(error?.message || 'Failed to delete assignment');
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold text-[#1f1f1f] mb-2'>
            Assignments
          </h2>
          <p className='text-muted-foreground'>
            Create and manage homework assignments
          </p>
        </div>
        <Link href='/teacher/assignments/create'>
          <Button className='bg-primary hover:bg-primary-dark'>
            <Plus className='mr-2 h-4 w-4' />
            Create Assignment
          </Button>
        </Link>
      </div>

      <div className='flex gap-2'>
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('all')}
          size='sm'
        >
          All
        </Button>
        <Button
          variant={filterStatus === 'draft' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('draft')}
          size='sm'
        >
          Draft
        </Button>
        <Button
          variant={filterStatus === 'published' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('published')}
          size='sm'
        >
          Published
        </Button>
        <Button
          variant={filterStatus === 'closed' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('closed')}
          size='sm'
        >
          Closed
        </Button>
      </div>

      {authError || !teacherId ? (
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>
            {authError || 'Please sign in as a teacher to view this page.'}
          </p>
        </div>
      ) : authLoading || isLoading ? (
        <ListSkeleton count={6} showTitle showFilters />
      ) : error ? (
        <div className='text-center py-12'>
          <p className='text-red-600 mb-4'>{error}</p>
          <Button variant='outline' onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div
            className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'
            style={{ gridAutoRows: '1fr' }}
          >
            {filteredAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                classIdToName={classIdToName}
                onDelete={handleDeleteAssignment}
              />
            ))}
          </div>

          {filteredAssignments.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-muted-foreground'>
                {assignments.length === 0
                  ? 'No assignments yet. Create your first assignment to get started!'
                  : 'No assignments found. Try adjusting your filters.'}
              </p>
              {assignments.length === 0 && (
                <Link
                  href='/teacher/assignments/create'
                  className='mt-4 inline-block'
                >
                  <Button className='bg-primary hover:bg-primary-dark'>
                    <Plus className='mr-2 h-4 w-4' />
                    Create Your First Assignment
                  </Button>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
