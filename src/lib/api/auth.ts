import { NextRequest, NextResponse } from 'next/server';
import { User, SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { unauthorized } from './response';

export async function getAuthenticatedUser(
  request: NextRequest
): Promise<{ user: User; supabase: SupabaseClient } | null> {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {
            // No-op for read-only auth check in API routes
          },
        },
      }
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return { user, supabase };
  } catch {
    return null;
  }
}

export async function requireAuth(
  request: NextRequest
): Promise<{ user: User; supabase: SupabaseClient } | NextResponse> {
  const result = await getAuthenticatedUser(request);
  if (!result) {
    return unauthorized();
  }
  return result;
}
