'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { StudentAssignmentCard } from '@/components/student/AssignmentCard';
import { Assignment, Submission } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { getAssignmentsByStudent } from '@/lib/services/assignments';
import { getSubmissionsByStudent } from '@/lib/services/submissions';
import { supabase } from '@/lib/supabase/client';

type FilterStatus = 'all' | 'not_started' | 'in_progress' | 'submitted' | 'graded' | 'overdue';

export default function StudentAssignmentsPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
          router.replace('/auth/signin');
          return;
        }
        setStudentId(user.id);
      } catch {
        router.replace('/auth/signin');
      } finally {
        setAuthChecked(true);
      }
    };
    getCurrentUser();
  }, [router]);

  // Fetch assignments and submissions (only when authenticated)
  useEffect(() => {
    if (!studentId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const [assignmentsResult, submissionsResult] = await Promise.all([
        getAssignmentsByStudent(studentId),
        getSubmissionsByStudent(studentId),
      ]);

      if (assignmentsResult.error) {
        setError(assignmentsResult.error.message);
        setIsLoading(false);
        return;
      }

      if (submissionsResult.error) {
        // Submissions error is not critical, continue without them
        console.warn('Failed to load submissions:', submissionsResult.error);
      }

      setAssignments(assignmentsResult.data || []);
      setSubmissions(submissionsResult.data || []);
      setIsLoading(false);
    };

    fetchData();
  }, [studentId]);

  // Create a map of assignment ID to submission
  const submissionMap = useMemo(() => {
    const map = new Map<string, Submission>();
    submissions.forEach((submission) => {
      map.set(submission.assignment_id, submission);
    });
    return map;
  }, [submissions]);

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    let filtered = assignments;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (assignment) =>
          assignment.title.toLowerCase().includes(query) ||
          assignment.description?.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((assignment) => {
        const submission = submissionMap.get(assignment.id);
        const now = new Date();
        const dueDate = new Date(assignment.due_date);
        const isOverdue = now > dueDate;

        switch (filterStatus) {
          case 'not_started':
            return !submission && !isOverdue;
          case 'in_progress':
            return submission && !submission.submitted_at;
          case 'submitted':
            return submission && submission.submitted_at && submission.status === 'pending';
          case 'graded':
            return submission && submission.status === 'graded';
          case 'overdue':
            return isOverdue && (!submission || !submission.submitted_at);
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [assignments, searchQuery, filterStatus, submissionMap]);

  if (!authChecked || (studentId && isLoading)) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-3 text-muted-foreground">Loading assignments...</span>
      </div>
    );
  }

  if (authChecked && !studentId) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#1f1f1f] mb-2">My Assignments</h2>
        <p className="text-muted-foreground">View and complete your assignments</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'not_started' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('not_started')}
            size="sm"
          >
            Not Started
          </Button>
          <Button
            variant={filterStatus === 'in_progress' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('in_progress')}
            size="sm"
          >
            In Progress
          </Button>
          <Button
            variant={filterStatus === 'submitted' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('submitted')}
            size="sm"
          >
            Submitted
          </Button>
          <Button
            variant={filterStatus === 'graded' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('graded')}
            size="sm"
          >
            Graded
          </Button>
          <Button
            variant={filterStatus === 'overdue' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('overdue')}
            size="sm"
          >
            Overdue
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-3 text-muted-foreground">Loading assignments...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAssignments.map((assignment) => (
              <StudentAssignmentCard
                key={assignment.id}
                assignment={assignment}
                submission={submissionMap.get(assignment.id)}
              />
            ))}
          </div>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {assignments.length === 0
                  ? 'No assignments available. Check back later!'
                  : 'No assignments found. Try adjusting your search or filters.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
