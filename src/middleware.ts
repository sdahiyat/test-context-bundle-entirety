import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const PROTECTED_PATHS = ['/dashboard'];
const AUTH_PATHS = ['/auth/login', '/auth/signup', '/auth/reset-password', '/auth/update-password'];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
}

function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some((path) => pathname.startsWith(path));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Extract cookies from the request to pass to Supabase
  const allCookies = request.cookies.getAll();
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');

  // Create a Supabase client with the request cookies forwarded
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  // Redirect unauthenticated users away from protected routes
  if (!isAuthenticated && isProtectedPath(pathname)) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthPath(pathname)) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
