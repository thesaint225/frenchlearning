'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useTeacherId(): {
  teacherId: string | null;
  loading: boolean;
  error: string | null;
} {
  const [teacherId, setTeacherId] = useState<string | null>(null);
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
          setTeacherId(null);
          setLoading(false);
          return;
        }

        if (!user) {
          setTeacherId(null);
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
          setTeacherId(null);
          setLoading(false);
          return;
        }

        if (profile?.role !== 'teacher') {
          setTeacherId(null);
          setLoading(false);
          return;
        }

        setTeacherId(user.id);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'An unexpected error occurred',
          );
          setTeacherId(null);
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

  return { teacherId, loading, error };
}
