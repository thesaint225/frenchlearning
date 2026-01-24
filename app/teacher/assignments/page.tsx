'use client';

import { useState, useMemo, useEffect } from 'react';
import { AssignmentCard } from '@/components/teacher/AssignmentCard';
import { Assignment, AssignmentStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getAssignmentsByTeacher } from '@/lib/services/assignments';

export default function AssignmentsPage() {
  const [filterStatus, setFilterStatus] = useState<AssignmentStatus | 'all'>('all');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace with actual teacher ID from auth context
  const teacherId = '00000000-0000-0000-0000-000000000000';

  // Fetch assignments from database
  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await getAssignmentsByTeacher(teacherId);
      
      if (fetchError || !data) {
        setError(fetchError?.message || 'Failed to load assignments');
        setIsLoading(false);
        return;
      }
      
      setAssignments(data);
      setIsLoading(false);
    };

    fetchAssignments();
  }, [teacherId]);

  const filteredAssignments = useMemo(() => {
    if (filterStatus === 'all') return assignments;
    return assignments.filter(assignment => assignment.status === filterStatus);
  }, [assignments, filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">Assignments</h2>
          <p className="text-muted-foreground">Create and manage homework assignments</p>
        </div>
        <Link href="/teacher/assignments/create">
          <Button className="bg-primary hover:bg-primary-dark">
            <Plus className="mr-2 h-4 w-4" />
            Create Assignment
          </Button>
        </Link>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('all')}
          size="sm"
        >
          All
        </Button>
        <Button
          variant={filterStatus === 'draft' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('draft')}
          size="sm"
        >
          Draft
        </Button>
        <Button
          variant={filterStatus === 'published' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('published')}
          size="sm"
        >
          Published
        </Button>
        <Button
          variant={filterStatus === 'closed' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('closed')}
          size="sm"
        >
          Closed
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-3 text-muted-foreground">Loading assignments...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {assignments.length === 0
                  ? 'No assignments yet. Create your first assignment to get started!'
                  : 'No assignments found. Try adjusting your filters.'}
              </p>
              {assignments.length === 0 && (
                <Link href="/teacher/assignments/create" className="mt-4 inline-block">
                  <Button className="bg-primary hover:bg-primary-dark">
                    <Plus className="mr-2 h-4 w-4" />
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
