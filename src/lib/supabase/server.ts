import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

/**
 * Server-side Supabase client with service role key for privileged operations.
 * Only use in server components, API routes, and server actions.
 * Never expose to the client.
 */
export async function createServerClient(): Promise<SupabaseClient<Database>> {
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY');
  }
  return createSupabaseClient<Database>(supabaseUrl!, supabaseServiceRoleKey);
}

/**
 * Server-side Supabase client using anon key with cookie-based session reading.
 * Use in server components that need to read the current user's session.
 */
export async function createServerComponentClient(): Promise<SupabaseClient<Database>> {
  if (!supabaseAnonKey) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  // Dynamically import cookies to avoid issues in non-Next.js environments
  const { cookies } = await import('next/headers');
  const cookieStore = cookies();

  // Extract all cookies and format them as a Cookie header string
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');

  return createSupabaseClient<Database>(supabaseUrl!, supabaseAnonKey, {
    global: {
      headers: {
        Cookie: cookieHeader,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
