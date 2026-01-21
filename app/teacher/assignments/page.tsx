'use client';

import { useState, useMemo } from 'react';
import { AssignmentCard } from '@/components/teacher/AssignmentCard';
import { mockAssignments } from '@/lib/mock-data';
import { AssignmentStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function AssignmentsPage() {
  const [filterStatus, setFilterStatus] = useState<AssignmentStatus | 'all'>('all');

  const filteredAssignments = useMemo(() => {
    if (filterStatus === 'all') return mockAssignments;
    return mockAssignments.filter(assignment => assignment.status === filterStatus);
  }, [filterStatus]);

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssignments.map(assignment => (
          <AssignmentCard key={assignment.id} assignment={assignment} />
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No assignments found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
