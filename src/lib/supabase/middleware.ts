import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/lib/supabase/types';

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write cookies to the request (for downstream middleware)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Re-create the response so it includes the updated cookies
          supabaseResponse = NextResponse.next({ request });
          // Write cookies to the response (sent to the browser)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the auth session — do NOT remove this call.
  // It keeps the user's session alive on every request.
  await supabase.auth.getUser();

  return supabaseResponse;
}
