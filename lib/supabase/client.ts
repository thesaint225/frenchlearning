import { createClient } from '@supabase/supabase-js';

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
 * Creates and returns a Supabase client for client-side use.
 * This client should be used in React components, hooks, and client-side code.
 *
 * @returns Supabase client instance
 * @throws Error if required environment variables are missing
 */
export const createSupabaseClient = () => {
  const { supabaseUrl, supabaseAnonKey } = validateEnvVars();

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
};

/**
 * Singleton instance of the Supabase client for client-side use.
 * Use this in client components and hooks.
 */
export const supabase = createSupabaseClient();
