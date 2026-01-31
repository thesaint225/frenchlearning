import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { StudentGuardian } from '@/lib/types';

interface GuardianRow {
  id: string;
  student_id: string;
  email: string;
  phone: string | null;
  relationship: string | null;
  created_at: string;
  updated_at: string | null;
}

const transformRow = (row: GuardianRow): StudentGuardian => ({
  id: row.id,
  student_id: row.student_id,
  email: row.email,
  phone: row.phone ?? undefined,
  relationship: row.relationship ?? undefined,
  created_at: row.created_at,
  updated_at: row.updated_at ?? undefined,
});

/**
 * Fetches all guardians for a student.
 * With RLS: students see their own; teachers see guardians for students in their classes.
 */
export const getGuardiansByStudentId = async (
  studentId: string
): Promise<{ data: StudentGuardian[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('student_guardians')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: true });

    if (error) {
      return {
        data: null,
        error: new Error(`Failed to fetch guardians: ${error.message}`),
      };
    }

    return {
      data: (data ?? []).map((row) => transformRow(row as GuardianRow)),
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error fetching guardians'),
    };
  }
};

/**
 * Creates a guardian for the current user (student). RLS ensures student_id = auth.uid().
 */
export const createGuardian = async (
  email: string,
  relationship?: string,
  phone?: string
): Promise<{ data: StudentGuardian | null; error: Error | null }> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const studentId = userData.user?.id;
    if (!studentId) {
      return { data: null, error: new Error('Not authenticated') };
    }

    const { data, error } = await supabase
      .from('student_guardians')
      .insert({
        student_id: studentId,
        email,
        relationship: relationship ?? null,
        phone: phone ?? null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(`Failed to add guardian: ${error.message}`) };
    }

    return { data: transformRow(data as GuardianRow), error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error creating guardian'),
    };
  }
};

/**
 * Updates a guardian. Caller must be the student who owns the row (RLS).
 */
export const updateGuardian = async (
  id: string,
  updates: { email?: string; phone?: string; relationship?: string }
): Promise<{ data: StudentGuardian | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('student_guardians')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(`Failed to update guardian: ${error.message}`) };
    }

    return { data: transformRow(data as GuardianRow), error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error updating guardian'),
    };
  }
};

/**
 * Deletes a guardian. Caller must be the student who owns the row (RLS).
 */
export const deleteGuardian = async (
  id: string
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.from('student_guardians').delete().eq('id', id);

    if (error) {
      return { error: new Error(`Failed to remove guardian: ${error.message}`) };
    }

    return { error: null };
  } catch (err) {
    return {
      error: err instanceof Error ? err : new Error('Unknown error deleting guardian'),
    };
  }
};

/**
 * Server-side: fetch guardians for a student using the given Supabase client.
 * Used in API routes (e.g. notify-parent) with createServerSupabaseClient() so RLS uses the teacher's session.
 */
export const getGuardiansByStudentIdWithClient = async (
  client: SupabaseClient,
  studentId: string
): Promise<{ data: StudentGuardian[] | null; error: Error | null }> => {
  try {
    const { data, error } = await client
      .from('student_guardians')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: true });

    if (error) {
      return {
        data: null,
        error: new Error(`Failed to fetch guardians: ${error.message}`),
      };
    }

    return {
      data: (data ?? []).map((row) => transformRow(row as GuardianRow)),
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error fetching guardians'),
    };
  }
};
