import { createClient, type SupabaseClient } from '@supabase/supabase-js';

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
export const createSupabaseClient = (): SupabaseClient => {
  const { supabaseUrl, supabaseAnonKey } = validateEnvVars();

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
};

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  if (typeof window === 'undefined') {
    throw new Error('Supabase client is only available in the browser');
  }
  _client = createSupabaseClient();
  return _client;
}

/**
 * Singleton Supabase client for client-side use. Created lazily on first
 * property access in the browser so prerender/SSR does not require env vars.
 * Use this in client components and hooks.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
