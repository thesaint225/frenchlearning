import { supabase } from '@/lib/supabase/client';
import { Submission, SubmissionStatus } from '@/lib/types';

/**
 * Database row type for submissions table.
 */
interface SubmissionRow {
  id: string;
  student_id: string;
  assignment_id: string;
  answers: any; // JSONB field for student answers
  status: 'draft' | 'submitted' | 'graded';
  score: number | null;
  max_score: number;
  feedback: string | null;
  submitted_at: string | null;
  graded_at: string | null;
  created_at: string;
  updated_at: string | null;
}

/**
 * Transforms a database row to a Submission type.
 */
const transformSubmissionRow = (row: SubmissionRow): Submission => {
  return {
    id: row.id,
    student_id: row.student_id,
    assignment_id: row.assignment_id,
    answers: row.answers || {},
    status:
      row.status === 'draft'
        ? 'pending'
        : row.status === 'submitted'
          ? 'pending'
          : 'graded',
    score: row.score || undefined,
    max_score: row.max_score,
    feedback: row.feedback || undefined,
    submitted_at: row.submitted_at || row.created_at,
    graded_at: row.graded_at || undefined,
  };
};

/**
 * Creates a new submission (draft) for a student assignment.
 *
 * @param studentId - The ID of the student
 * @param assignmentId - The ID of the assignment
 * @param answers - Student's answers (can be partial for draft)
 * @param maxScore - Maximum score for the assignment
 * @returns Object with submission data or error
 */
export const createSubmission = async (
  studentId: string,
  assignmentId: string,
  answers: Record<string, any>,
  maxScore: number,
): Promise<{ data: Submission | null; error: Error | null }> => {
  try {
    // Check if submission already exists
    const { data: existing } = await supabase
      .from('submissions')
      .select('id')
      .eq('student_id', studentId)
      .eq('assignment_id', assignmentId)
      .single();

    if (existing) {
      // Update existing draft submission
      return updateSubmission(existing.id, answers);
    }

    // Create new submission
    const submissionData = {
      student_id: studentId,
      assignment_id: assignmentId,
      answers,
      status: 'draft',
      max_score: maxScore,
      submitted_at: null,
      score: null,
      feedback: null,
      graded_at: null,
    };

    const { data, error } = await supabase
      .from('submissions')
      .insert(submissionData)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: new Error(`Failed to create submission: ${error.message}`),
      };
    }

    return { data: transformSubmissionRow(data as SubmissionRow), error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error('Unknown error occurred while creating submission'),
    };
  }
};

/**
 * Updates an existing submission (for draft saves).
 *
 * @param submissionId - The ID of the submission
 * @param answers - Updated answers
 * @returns Object with updated submission data or error
 */
export const updateSubmission = async (
  submissionId: string,
  answers: Record<string, any>,
): Promise<{ data: Submission | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .update({
        answers,
        updated_at: new Date().toISOString(),
      })
      .eq('id', submissionId)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: new Error(`Failed to update submission: ${error.message}`),
      };
    }

    return { data: transformSubmissionRow(data as SubmissionRow), error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error('Unknown error occurred while updating submission'),
    };
  }
};

/**
 * Submits a submission (changes status from draft to submitted).
 *
 * @param submissionId - The ID of the submission
 * @returns Object with updated submission data or error
 */
export const submitSubmission = async (
  submissionId: string,
): Promise<{ data: Submission | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', submissionId)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: new Error(`Failed to submit: ${error.message}`),
      };
    }

    // Update assignment submission count
    const submission = data as SubmissionRow;
    await updateAssignmentSubmissionCount(submission.assignment_id);

    return { data: transformSubmissionRow(data as SubmissionRow), error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error('Unknown error occurred while submitting'),
    };
  }
};

/**
 * Grades a submission by updating score, feedback, and status.
 *
 * @param submissionId - The ID of the submission
 * @param score - The score to assign
 * @param feedback - Optional feedback for the student
 * @returns Object with updated submission data or error
 */
export const gradeSubmission = async (
  submissionId: string,
  score: number,
  feedback?: string,
): Promise<{ data: Submission | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .update({
        score,
        feedback: feedback || null,
        status: 'graded',
        graded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', submissionId)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: new Error(`Failed to grade submission: ${error.message}`),
      };
    }

    // Update assignment submission count
    const submission = data as SubmissionRow;
    await updateAssignmentSubmissionCount(submission.assignment_id);

    return { data: transformSubmissionRow(data as SubmissionRow), error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error('Unknown error occurred while grading submission'),
    };
  }
};

/**
 * Fetches all submissions for a specific assignment.
 *
 * @param assignmentId - The ID of the assignment
 * @returns Object with array of submissions or error
 */
export const getSubmissionsByAssignment = async (
  assignmentId: string,
): Promise<{ data: Submission[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .order('submitted_at', { ascending: false, nullsFirst: false });

    if (error) {
      return {
        data: null,
        error: new Error(`Failed to fetch submissions: ${error.message}`),
      };
    }

    const submissions = (data as SubmissionRow[]).map(transformSubmissionRow);
    return { data: submissions, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error('Unknown error occurred while fetching submissions'),
    };
  }
};

/**
 * Fetches all submissions for a specific student.
 *
 * @param studentId - The ID of the student
 * @returns Object with array of submissions or error
 */
export const getSubmissionsByStudent = async (
  studentId: string,
): Promise<{ data: Submission[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false, nullsFirst: false });

    if (error) {
      return {
        data: null,
        error: new Error(`Failed to fetch submissions: ${error.message}`),
      };
    }

    const submissions = (data as SubmissionRow[]).map(transformSubmissionRow);
    return { data: submissions, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error('Unknown error occurred while fetching submissions'),
    };
  }
};

/**
 * Fetches a single submission by ID.
 *
 * @param submissionId - The ID of the submission
 * @returns Object with submission data or error
 */
export const getSubmissionById = async (
  submissionId: string,
): Promise<{ data: Submission | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (error) {
      return {
        data: null,
        error: new Error(`Failed to fetch submission: ${error.message}`),
      };
    }

    return { data: transformSubmissionRow(data as SubmissionRow), error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error('Unknown error occurred while fetching submission'),
    };
  }
};

/**
 * Fetches a submission for a specific student and assignment.
 *
 * @param studentId - The ID of the student
 * @param assignmentId - The ID of the assignment
 * @returns Object with submission data or error
 */
export const getSubmissionByStudentAndAssignment = async (
  studentId: string,
  assignmentId: string,
): Promise<{ data: Submission | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('student_id', studentId)
      .eq('assignment_id', assignmentId)
      .maybeSingle();

    if (error) {
      return {
        data: null,
        error: new Error(`Failed to fetch submission: ${error.message}`),
      };
    }

    if (!data) {
      return { data: null, error: null };
    }

    return { data: transformSubmissionRow(data as SubmissionRow), error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error('Unknown error occurred while fetching submission'),
    };
  }
};

/**
 * Gets the count of pending submissions for a specific teacher.
 * Pending submissions are those with status 'submitted' in the database
 * (which map to 'pending' in the app layer).
 *
 * @param teacherId - The ID of the teacher
 * @returns Object with count number or error
 */
export const getPendingSubmissionsCount = async (
  teacherId: string,
): Promise<{ data: number | null; error: Error | null }> => {
  try {
    // First, get all assignments for this teacher
    const { data: assignments, error: assignmentsError } = await supabase
      .from('assignments')
      .select('id')
      .eq('teacher_id', teacherId);

    if (assignmentsError) {
      return {
        data: null,
        error: new Error(
          `Failed to fetch assignments: ${assignmentsError.message}`,
        ),
      };
    }

    if (!assignments || assignments.length === 0) {
      return { data: 0, error: null };
    }

    const assignmentIds = assignments.map((a) => a.id);

    // Count submissions with status 'submitted' (which are pending grading)
    const { count, error } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .in('assignment_id', assignmentIds)
      .eq('status', 'submitted');

    if (error) {
      return {
        data: null,
        error: new Error(`Failed to count submissions: ${error.message}`),
      };
    }

    return { data: count || 0, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error('Unknown error occurred while counting submissions'),
    };
  }
};

/**
 * Fetches all submissions for assignments created by a specific teacher.
 *
 * @param teacherId - The ID of the teacher
 * @returns Object with array of submissions or error
 */
export const getSubmissionsByTeacher = async (
  teacherId: string,
): Promise<{ data: Submission[] | null; error: Error | null }> => {
  try {
    // First, get all assignments for this teacher
    const { data: assignments, error: assignmentsError } = await supabase
      .from('assignments')
      .select('id')
      .eq('teacher_id', teacherId);

    if (assignmentsError) {
      return {
        data: null,
        error: new Error(
          `Failed to fetch assignments: ${assignmentsError.message}`,
        ),
      };
    }

    if (!assignments || assignments.length === 0) {
      return { data: [], error: null };
    }

    const assignmentIds = assignments.map((a) => a.id);

    // Get all submissions for these assignments
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .in('assignment_id', assignmentIds)
      .order('submitted_at', { ascending: false, nullsFirst: false });

    if (error) {
      return {
        data: null,
        error: new Error(`Failed to fetch submissions: ${error.message}`),
      };
    }

    const submissions = (data as SubmissionRow[]).map(transformSubmissionRow);
    return { data: submissions, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error('Unknown error occurred while fetching submissions'),
    };
  }
};

/**
 * Updates assignment submission count and completion rate.
 * This is called automatically when a submission is created or graded.
 */
const updateAssignmentSubmissionCount = async (
  assignmentId: string,
): Promise<void> => {
  try {
    // Get total submissions count
    const { count } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .eq('assignment_id', assignmentId)
      .eq('status', 'submitted');

    // Get assignment to calculate completion rate
    const { data: assignment } = await supabase
      .from('assignments')
      .select('class_id')
      .eq('id', assignmentId)
      .single();

    if (!assignment) return;

    // Get total enrolled students in the class
    const { count: enrolledCount } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('class_id', assignment.class_id)
      .eq('status', 'active');

    const submissionCount = count || 0;
    const totalStudents = enrolledCount || 1;
    const completionRate =
      totalStudents > 0 ? (submissionCount / totalStudents) * 100 : 0;

    // Update assignment
    await supabase
      .from('assignments')
      .update({
        submission_count: submissionCount,
        completion_rate: Math.round(completionRate * 100) / 100, // Round to 2 decimal places
      })
      .eq('id', assignmentId);
  } catch (error) {
    // Silently fail - this is a background update
    console.error('Failed to update assignment submission count:', error);
  }
};
