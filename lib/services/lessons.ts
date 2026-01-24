import { supabase } from '@/lib/supabase/client';
import { createLessonSchema, updateLessonSchema, type CreateLessonInput, type UpdateLessonInput } from '@/lib/schemas/lesson';
import { Lesson } from '@/lib/types';

/**
 * Database row type for lessons table.
 */
interface LessonRow {
  id: string;
  title: string;
  description: string | null;
  type: 'video' | 'audio' | 'exercise';
  content: {
    videoUrl?: string;
    audioUrl?: string;
    exercise?: any;
  };
  teacher_id: string;
  created_at: string;
  updated_at: string | null;
  completion_count: number;
}

/**
 * Transforms a database row to a Lesson type.
 */
const transformLessonRow = (row: LessonRow): Lesson => {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    type: row.type,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at || undefined,
    completion_count: row.completion_count,
  };
};

/**
 * Creates a new lesson in the database.
 *
 * @param input - Lesson data validated with Zod schema
 * @returns Object with lesson data or error
 */
export const createLesson = async (
  input: CreateLessonInput
): Promise<{ data: Lesson | null; error: Error | null }> => {
  try {
    // Validate input with Zod schema
    const validatedInput = createLessonSchema.parse(input);

    // Prepare data for database insertion
    const lessonData = {
      title: validatedInput.title,
      description: validatedInput.description || null,
      type: validatedInput.type,
      content: validatedInput.content,
      teacher_id: validatedInput.teacher_id,
    };

    // Insert lesson into database
    const { data, error } = await supabase
      .from('lessons')
      .insert(lessonData)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(`Failed to create lesson: ${error.message}`) };
    }

    return { data: transformLessonRow(data as LessonRow), error: null };
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
    return { data: null, error: new Error('Unknown error occurred while creating lesson') };
  }
};

/**
 * Fetches all lessons for a specific teacher.
 *
 * @param teacherId - The ID of the teacher
 * @returns Object with array of lessons or error
 */
export const getLessonsByTeacher = async (
  teacherId: string
): Promise<{ data: Lesson[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(`Failed to fetch lessons: ${error.message}`) };
    }

    const lessons = (data as LessonRow[]).map(transformLessonRow);
    return { data: lessons, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred while fetching lessons'),
    };
  }
};

/**
 * Fetches a single lesson by ID.
 *
 * @param lessonId - The ID of the lesson
 * @returns Object with lesson data or error
 */
export const getLessonById = async (
  lessonId: string
): Promise<{ data: Lesson | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (error) {
      return { data: null, error: new Error(`Failed to fetch lesson: ${error.message}`) };
    }

    return { data: transformLessonRow(data as LessonRow), error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred while fetching lesson'),
    };
  }
};

/**
 * Updates an existing lesson.
 *
 * @param input - Lesson update data validated with Zod schema
 * @returns Object with updated lesson data or error
 */
export const updateLesson = async (
  input: UpdateLessonInput
): Promise<{ data: Lesson | null; error: Error | null }> => {
  try {
    // Validate input with Zod schema
    const validatedInput = updateLessonSchema.parse(input);

    const { id, ...updateData } = validatedInput;

    // Prepare update data (only include defined fields)
    const lessonUpdate: Partial<LessonRow> = {};
    if (updateData.title !== undefined) lessonUpdate.title = updateData.title;
    if (updateData.description !== undefined) lessonUpdate.description = updateData.description || null;
    if (updateData.type !== undefined) lessonUpdate.type = updateData.type;
    if (updateData.content !== undefined) lessonUpdate.content = updateData.content;
    lessonUpdate.updated_at = new Date().toISOString();

    // Update lesson in database
    const { data, error } = await supabase
      .from('lessons')
      .update(lessonUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(`Failed to update lesson: ${error.message}`) };
    }

    return { data: transformLessonRow(data as LessonRow), error: null };
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
    return { data: null, error: new Error('Unknown error occurred while updating lesson') };
  }
};

/**
 * Deletes a lesson from the database.
 *
 * @param lessonId - The ID of the lesson to delete
 * @returns Object with success status or error
 */
export const deleteLesson = async (
  lessonId: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase.from('lessons').delete().eq('id', lessonId);

    if (error) {
      return { success: false, error: new Error(`Failed to delete lesson: ${error.message}`) };
    }

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error occurred while deleting lesson'),
    };
  }
};

/**
 * Checks if a lesson exists and belongs to a specific teacher.
 *
 * @param lessonId - The ID of the lesson
 * @param teacherId - The ID of the teacher
 * @returns Object with boolean result or error
 */
export const verifyLessonOwnership = async (
  lessonId: string,
  teacherId: string
): Promise<{ isOwner: boolean; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('teacher_id')
      .eq('id', lessonId)
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
