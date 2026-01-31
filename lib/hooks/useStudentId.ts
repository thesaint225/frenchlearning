'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useStudentId(): {
  studentId: string | null;
  loading: boolean;
  error: string | null;
} {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (cancelled) return;

        if (authError) {
          setError(authError.message || 'Failed to get user');
          setStudentId(null);
          setLoading(false);
          return;
        }

        if (!user) {
          setStudentId(null);
          setLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (cancelled) return;

        if (profileError) {
          setError(profileError.message || 'Failed to load profile');
          setStudentId(null);
          setLoading(false);
          return;
        }

        if (profile?.role !== 'student') {
          setStudentId(null);
          setLoading(false);
          return;
        }

        setStudentId(user.id);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'An unexpected error occurred',
          );
          setStudentId(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    resolve();
    return () => {
      cancelled = true;
    };
  }, []);

  return { studentId, loading, error };
}
