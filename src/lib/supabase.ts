// Compatibility shim - re-exports from the modular supabase lib directory
// This allows `import { supabase } from '@/lib/supabase'` as documented in the scaffold

export {
  createClient,
  createServerClient,
  updateSession,
} from '@/lib/supabase/index';

export type { Database } from '@/lib/supabase/types';

// Browser client singleton for convenience
import { createClient } from '@/lib/supabase/client';
export const supabase = createClient();

// Server client factory using service role key for privileged server-side operations
import { createClient as supabaseCreateClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required'
    );
  }

  return supabaseCreateClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
