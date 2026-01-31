import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Validates that required Supabase environment variables are present.
 * Throws an error if any are missing.
 */
const validateEnvVars = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }

  return { supabaseUrl, supabaseAnonKey };
};

/**
 * Creates a Supabase client for server-side use (Server Components, Server Actions, API Routes).
 * Uses @supabase/ssr so the session is read from cookies and shared with the client.
 *
 * @returns Supabase client instance configured for server-side use
 * @throws Error if required environment variables are missing
 */
export const createServerSupabaseClient = async () => {
  const { supabaseUrl, supabaseAnonKey } = validateEnvVars();
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll was called from a Server Component; ignore (middleware refreshes sessions)
        }
      },
    },
  });
};

/**
 * Creates a Supabase admin client for server-side operations that require elevated privileges.
 * Use this sparingly and only in secure server contexts.
 *
 * @returns Supabase admin client instance
 * @throws Error if required environment variables are missing
 */
export const createAdminSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }

  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};
