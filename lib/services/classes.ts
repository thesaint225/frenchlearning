import { supabase } from '@/lib/supabase/client';
import { Class } from '@/lib/types';

/**
 * Database row type for classes table.
 */
interface ClassRow {
  id: string;
  teacher_id: string;
  name: string;
  description: string | null;
  class_code: string;
  settings: {
    invitation_method?: 'code' | 'email' | 'both';
    allow_self_enrollment?: boolean;
  } | null;
  created_at: string;
  updated_at: string | null;
}

const transformClassRow = (row: ClassRow): Class => ({
  id: row.id,
  teacher_id: row.teacher_id,
  name: row.name,
  description: row.description || undefined,
  class_code: row.class_code,
  settings: row.settings || undefined,
  created_at: row.created_at,
  updated_at: row.updated_at || undefined,
});

/**
 * Fetches all classes for a given teacher.
 */
export const getClassesByTeacher = async (
  teacherId: string
): Promise<{ data: Class[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) {
      return {
        data: null,
        error: new Error(`Failed to fetch classes: ${error.message}`),
      };
    }

    const classes = (data as ClassRow[]).map(transformClassRow);
    return { data: classes, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error fetching classes'),
    };
  }
};

/**
 * Fetches all classes a student is enrolled in (active enrollments only).
 */
export const getClassesByStudent = async (
  studentId: string
): Promise<{ data: Class[] | null; error: Error | null }> => {
  try {
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
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .in('id', classIds)
      .order('name', { ascending: true });

    if (error) {
      return {
        data: null,
        error: new Error(`Failed to fetch classes: ${error.message}`),
      };
    }

    const classes = (data as ClassRow[]).map(transformClassRow);
    return { data: classes, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error fetching student classes'),
    };
  }
};

export type CreateClassInput = {
  name: string;
  description?: string;
  class_code: string;
  settings?: {
    invitation_method?: 'code' | 'email' | 'both';
    allow_self_enrollment?: boolean;
  };
};

/**
 * Creates a new class for a teacher.
 */
export const createClass = async (
  teacherId: string,
  input: CreateClassInput
): Promise<{ data: Class | null; error: Error | null }> => {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('classes')
      .insert({
        teacher_id: teacherId,
        name: input.name,
        description: input.description ?? null,
        class_code: input.class_code,
        settings: input.settings ?? null,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: new Error(`Failed to create class: ${error.message}`),
      };
    }

    return { data: transformClassRow(data as ClassRow), error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error creating class'),
    };
  }
};

/**
 * Fetches a class by its class code (case-insensitive, trimmed).
 */
export const getClassByCode = async (
  classCode: string
): Promise<{ data: Class | null; error: Error | null }> => {
  try {
    const trimmed = classCode.trim();
    if (!trimmed) {
      return { data: null, error: new Error('Class code is required') };
    }
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .ilike('class_code', trimmed)
      .limit(1)
      .maybeSingle();

    if (error) {
      return {
        data: null,
        error: new Error(`Failed to fetch class: ${error.message}`),
      };
    }
    return {
      data: data ? transformClassRow(data as ClassRow) : null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error fetching class by code'),
    };
  }
};

export type EnrollByCodeResult =
  | { success: true; className: string }
  | { success: false; error: string };

/**
 * Enrolls a student in a class using the class code.
 * Returns success with class name, or failure with a clear error message.
 */
export const enrollStudentByCode = async (
  studentId: string,
  classCode: string
): Promise<EnrollByCodeResult> => {
  try {
    const trimmed = classCode.trim();
    if (!trimmed) {
      return { success: false, error: 'Class code is required' };
    }

    const { data: classData, error: classError } = await getClassByCode(trimmed);
    if (classError) {
      return { success: false, error: classError.message };
    }
    if (!classData) {
      return { success: false, error: 'Invalid or expired code. Check the code and try again.' };
    }
    if (classData.settings?.allow_self_enrollment === false) {
      return {
        success: false,
        error: 'Joining by code is not allowed for this class.',
      };
    }

    const { data: existing, error: existingError } = await supabase
      .from('enrollments')
      .select('id')
      .eq('class_id', classData.id)
      .eq('student_id', studentId)
      .eq('status', 'active')
      .maybeSingle();

    if (existingError) {
      return { success: false, error: existingError.message };
    }
    if (existing) {
      return { success: false, error: "You're already in this class." };
    }

    const { error: insertError } = await supabase.from('enrollments').insert({
      class_id: classData.id,
      student_id: studentId,
      status: 'active',
      enrollment_method: 'code',
    });

    if (insertError) {
      return { success: false, error: insertError.message };
    }
    return { success: true, className: classData.name };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
    };
  }
};

/**
 * Returns the number of active enrollments for a class.
 */
export const getEnrollmentCountByClass = async (
  classId: string
): Promise<{ data: number; error: Error | null }> => {
  try {
    const { count, error } = await supabase
      .from('enrollments')
      .select('id', { count: 'exact', head: true })
      .eq('class_id', classId)
      .eq('status', 'active');

    if (error) {
      return {
        data: 0,
        error: new Error(`Failed to fetch enrollment count: ${error.message}`),
      };
    }

    return { data: count ?? 0, error: null };
  } catch (err) {
    return {
      data: 0,
      error: err instanceof Error ? err : new Error('Unknown error fetching enrollment count'),
    };
  }
};
