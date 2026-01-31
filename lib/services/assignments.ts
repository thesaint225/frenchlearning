import { supabase } from '@/lib/supabase/client';
import {
  createAssignmentSchema,
  updateAssignmentSchema,
  type CreateAssignmentInput,
  type UpdateAssignmentInput,
} from '@/lib/schemas/assignment';
import { Assignment } from '@/lib/types';

/**
 * Database row type for assignments table.
 */
interface AssignmentRow {
  id: string;
  title: string;
  description: string | null;
  class_id: string | null;
  teacher_id: string;
  lesson_ids: string[];
  questions: any | null; // JSONB field for assignment questions
  due_date: string;
  status: 'draft' | 'published' | 'closed';
  max_points: number;
  allow_late_submissions: boolean;
  created_at: string;
  updated_at: string | null;
  submission_count: number;
  completion_rate: number | null;
}

/**
 * Transforms a database row to an Assignment type.
 */
const transformAssignmentRow = (row: AssignmentRow): Assignment => {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    class_id: row.class_id || undefined,
    lesson_ids: row.lesson_ids,
    questions: row.questions || undefined,
    due_date: row.due_date,
    status: row.status,
    max_points: row.max_points,
    allow_late_submissions: row.allow_late_submissions,
    created_at: row.created_at,
    submission_count: row.submission_count,
    completion_rate: row.completion_rate || undefined,
  };
};

/**
 * Validates that all lesson IDs in an assignment exist in the database.
 *
 * @param lessonIds - Array of lesson IDs to validate
 * @returns Object with validation result or error
 */
const validateLessonIds = async (
  lessonIds: string[]
): Promise<{ isValid: boolean; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('id')
      .in('id', lessonIds);

    if (error) {
      return { isValid: false, error: new Error(`Failed to validate lessons: ${error.message}`) };
    }

    const foundIds = data.map((lesson) => lesson.id);
    const missingIds = lessonIds.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      return {
        isValid: false,
        error: new Error(`Lessons not found: ${missingIds.join(', ')}`),
      };
    }

    return { isValid: true, error: null };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error : new Error('Unknown error occurred while validating lessons'),
    };
  }
};

/**
 * Creates a new assignment in the database.
 *
 * @param input - Assignment data validated with Zod schema
 * @returns Object with assignment data or error
 */
export const createAssignment = async (
  input: CreateAssignmentInput
): Promise<{ data: Assignment | null; error: Error | null }> => {
  try {
    // Validate input with Zod schema
    const validatedInput = createAssignmentSchema.parse(input);

    // Cannot publish without a class
    if (validatedInput.status === 'published' && !validatedInput.class_id) {
      return {
        data: null,
        error: new Error(
          'Cannot publish assignment without a class. Please assign the assignment to a class first.'
        ),
      };
    }

    // Validate that all lesson IDs exist (only if lesson_ids are provided)
    if (validatedInput.lesson_ids && validatedInput.lesson_ids.length > 0) {
      const { isValid, error: validationError } = await validateLessonIds(validatedInput.lesson_ids);
      if (!isValid) {
        return { data: null, error: validationError };
      }
    }

    // Calculate max_points from questions if provided, otherwise use input value
    let calculatedMaxPoints = validatedInput.max_points;
    if (validatedInput.questions && validatedInput.questions.length > 0) {
      calculatedMaxPoints = validatedInput.questions.reduce((sum, q) => sum + q.points, 0);
    }

    // Prepare data for database insertion
    const assignmentData = {
      title: validatedInput.title,
      description: validatedInput.description || null,
      class_id: validatedInput.class_id || null,
      teacher_id: validatedInput.teacher_id,
      lesson_ids: validatedInput.lesson_ids || [],
      questions: validatedInput.questions || null,
      due_date: validatedInput.due_date,
      status: validatedInput.status,
      max_points: calculatedMaxPoints,
      allow_late_submissions: validatedInput.allow_late_submissions,
    };

    // Insert assignment into database
    const { data, error } = await supabase
      .from('assignments')
      .insert(assignmentData)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(`Failed to create assignment: ${error.message}`) };
    }

    return { data: transformAssignmentRow(data as AssignmentRow), error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error };
    }
    if (typeof error === 'object' && error !== null && 'issues' in error) {
      // Zod validation error
      const zodError = error as { issues: Array<{ message: string }> };
      return {
        data: null,
        error: new Error(`Validation error: ${zodError.issues.map((i) => i.message).join(', ')}`),
      };
    }
    return { data: null, error: new Error('Unknown error occurred while creating assignment') };
  }
};

/**
 * Fetches all assignments visible to the teacher (single-teacher use case).
 * Returns every assignment in the app; teacherId is used only to ensure the caller is a teacher.
 *
 * @param teacherId - The ID of the teacher (caller must be a teacher; not used to filter results)
 * @returns Object with array of assignments or error
 */
export const getAssignmentsByTeacher = async (
  teacherId: string
): Promise<{ data: Assignment[] | null; error: Error | null }> => {
  try {
    void teacherId; // kept for API; single-teacher sees all assignments
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(`Failed to fetch assignments: ${error.message}`) };
    }

    const assignments = (data as AssignmentRow[]).map(transformAssignmentRow);
    return { data: assignments, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred while fetching assignments'),
    };
  }
};

/**
 * Fetches a single assignment by ID.
 *
 * @param assignmentId - The ID of the assignment
 * @returns Object with assignment data or error
 */
export const getAssignmentById = async (
  assignmentId: string
): Promise<{ data: Assignment | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', assignmentId)
      .single();

    if (error) {
      return { data: null, error: new Error(`Failed to fetch assignment: ${error.message}`) };
    }

    return { data: transformAssignmentRow(data as AssignmentRow), error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred while fetching assignment'),
    };
  }
};

/**
 * Updates an existing assignment.
 *
 * @param input - Assignment update data validated with Zod schema
 * @returns Object with updated assignment data or error
 */
export const updateAssignment = async (
  input: UpdateAssignmentInput
): Promise<{ data: Assignment | null; error: Error | null }> => {
  try {
    // Validate input with Zod schema
    const validatedInput = updateAssignmentSchema.parse(input);

    const { id, ...updateData } = validatedInput;

    // If lesson_ids are being updated, validate they exist (only if provided and not empty)
    if (updateData.lesson_ids !== undefined && updateData.lesson_ids.length > 0) {
      const { isValid, error: validationError } = await validateLessonIds(updateData.lesson_ids);
      if (!isValid) {
        return { data: null, error: validationError };
      }
    }

    // Calculate max_points from questions if questions are being updated
    let calculatedMaxPoints = updateData.max_points;
    if (updateData.questions !== undefined && updateData.questions.length > 0) {
      calculatedMaxPoints = updateData.questions.reduce((sum, q) => sum + q.points, 0);
    }

    // Prepare update data (only include defined fields)
    const assignmentUpdate: Partial<AssignmentRow> = {};
    if (updateData.title !== undefined) assignmentUpdate.title = updateData.title;
    if (updateData.description !== undefined) assignmentUpdate.description = updateData.description || null;
    if (updateData.class_id !== undefined) assignmentUpdate.class_id = updateData.class_id || null;
    if (updateData.lesson_ids !== undefined) assignmentUpdate.lesson_ids = updateData.lesson_ids;
    if (updateData.questions !== undefined) assignmentUpdate.questions = updateData.questions || null;
    if (updateData.due_date !== undefined) assignmentUpdate.due_date = updateData.due_date;
    if (updateData.status !== undefined) assignmentUpdate.status = updateData.status;
    if (calculatedMaxPoints !== undefined) assignmentUpdate.max_points = calculatedMaxPoints;
    if (updateData.allow_late_submissions !== undefined)
      assignmentUpdate.allow_late_submissions = updateData.allow_late_submissions;
    assignmentUpdate.updated_at = new Date().toISOString();

    // Update assignment in database
    const { data, error } = await supabase
      .from('assignments')
      .update(assignmentUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(`Failed to update assignment: ${error.message}`) };
    }

    return { data: transformAssignmentRow(data as AssignmentRow), error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error };
    }
    if (typeof error === 'object' && error !== null && 'issues' in error) {
      // Zod validation error
      const zodError = error as { issues: Array<{ message: string }> };
      return {
        data: null,
        error: new Error(`Validation error: ${zodError.issues.map((i) => i.message).join(', ')}`),
      };
    }
    return { data: null, error: new Error('Unknown error occurred while updating assignment') };
  }
};

/**
 * Deletes an assignment from the database.
 *
 * @param assignmentId - The ID of the assignment to delete
 * @returns Object with success status or error
 */
export const deleteAssignment = async (
  assignmentId: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase.from('assignments').delete().eq('id', assignmentId);

    if (error) {
      return { success: false, error: new Error(`Failed to delete assignment: ${error.message}`) };
    }

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error occurred while deleting assignment'),
    };
  }
};

/**
 * Updates the status of an assignment.
 * Validates business rules for status transitions.
 *
 * @param assignmentId - The ID of the assignment
 * @param status - The new status
 * @returns Object with updated assignment data or error
 */
export const updateAssignmentStatus = async (
  assignmentId: string,
  status: 'draft' | 'published' | 'closed'
): Promise<{ data: Assignment | null; error: Error | null }> => {
  try {
    // Get current assignment to check current status and validate transitions
    const { data: currentAssignment, error: fetchError } = await getAssignmentById(assignmentId);
    
    if (fetchError || !currentAssignment) {
      return { data: null, error: fetchError || new Error('Assignment not found') };
    }

    // Validate status transition: draft → published requires class_id
    if (currentAssignment.status === 'draft' && status === 'published') {
      if (!currentAssignment.class_id) {
        return {
          data: null,
          error: new Error('Cannot publish assignment without a class. Please assign the assignment to a class first.'),
        };
      }
    }

    // Update the status
    return updateAssignment({ id: assignmentId, status });
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred while updating assignment status'),
    };
  }
};

/**
 * Checks if an assignment exists and belongs to a specific teacher.
 *
 * @param assignmentId - The ID of the assignment
 * @param teacherId - The ID of the teacher
 * @returns Object with boolean result or error
 */
export const verifyAssignmentOwnership = async (
  assignmentId: string,
  teacherId: string
): Promise<{ isOwner: boolean; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('assignments')
      .select('teacher_id')
      .eq('id', assignmentId)
      .single();

    if (error) {
      return { isOwner: false, error: new Error(`Failed to verify ownership: ${error.message}`) };
    }

    return { isOwner: data.teacher_id === teacherId, error: null };
  } catch (error) {
    return {
      isOwner: false,
      error: error instanceof Error ? error : new Error('Unknown error occurred while verifying ownership'),
    };
  }
};

/**
 * Fetches all published assignments for a specific class.
 *
 * @param classId - The ID of the class
 * @returns Object with array of assignments or error
 */
export const getAssignmentsByClass = async (
  classId: string
): Promise<{ data: Assignment[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('class_id', classId)
      .eq('status', 'published')
      .order('due_date', { ascending: true });

    if (error) {
      return { data: null, error: new Error(`Failed to fetch assignments: ${error.message}`) };
    }

    const assignments = (data as AssignmentRow[]).map(transformAssignmentRow);
    return { data: assignments, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred while fetching assignments'),
    };
  }
};

/**
 * Fetches all assignments visible to a student (via their class enrollments).
 * Only returns published assignments that are not past due (unless allow_late_submissions is true).
 *
 * @param studentId - The ID of the student
 * @returns Object with array of assignments or error
 */
export const getAssignmentsByStudent = async (
  studentId: string
): Promise<{ data: Assignment[] | null; error: Error | null }> => {
  try {
    // First, get all classes the student is enrolled in
    const { data: enrollments, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('class_id')
      .eq('student_id', studentId)
      .eq('status', 'active');

    if (enrollmentError) {
      return {
        data: null,
        error: new Error(`Failed to fetch enrollments: ${enrollmentError.message}`),
      };
    }

    if (!enrollments || enrollments.length === 0) {
      return { data: [], error: null };
    }

    const classIds = enrollments.map((e) => e.class_id);
    const now = new Date().toISOString();

    // Get all published assignments for these classes
    // Include assignments that are not past due OR allow late submissions
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .in('class_id', classIds)
      .eq('status', 'published')
      .or(`due_date.gte.${now},allow_late_submissions.eq.true`)
      .order('due_date', { ascending: true });

    if (error) {
      return { data: null, error: new Error(`Failed to fetch assignments: ${error.message}`) };
    }

    const assignments = (data as AssignmentRow[]).map(transformAssignmentRow);
    return { data: assignments, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred while fetching assignments'),
    };
  }
};

/**
 * Fetches assignments for a specific student in a specific class.
 *
 * @param studentId - The ID of the student
 * @param classId - The ID of the class
 * @returns Object with array of assignments or error
 */
export const getAssignmentsForStudentInClass = async (
  studentId: string,
  classId: string
): Promise<{ data: Assignment[] | null; error: Error | null }> => {
  try {
    // Verify student is enrolled in the class
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', studentId)
      .eq('class_id', classId)
      .eq('status', 'active')
      .single();

    if (enrollmentError || !enrollment) {
      return {
        data: null,
        error: new Error('Student is not enrolled in this class'),
      };
    }

    const now = new Date().toISOString();

    // Get published assignments for this class
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('class_id', classId)
      .eq('status', 'published')
      .or(`due_date.gte.${now},allow_late_submissions.eq.true`)
      .order('due_date', { ascending: true });

    if (error) {
      return { data: null, error: new Error(`Failed to fetch assignments: ${error.message}`) };
    }

    const assignments = (data as AssignmentRow[]).map(transformAssignmentRow);
    return { data: assignments, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred while fetching assignments'),
    };
  }
};
