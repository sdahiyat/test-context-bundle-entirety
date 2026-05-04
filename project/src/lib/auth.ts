/**
 * Simple auth utilities for Next.js API routes.
 * Validates a Bearer token from the Authorization header.
 * In this demo, the "token" is a base64-encoded JSON payload: { id, email }.
 */

import { NextRequest } from 'next/server';

export interface AuthUser {
  id: string;
  email: string;
}

/**
 * Extract and validate the auth user from a Next.js request.
 * Returns null if not authenticated.
 */
export function getAuthUser(request: NextRequest): AuthUser | null {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);

  try {
    // Demo: token is base64-encoded JSON { id, email }
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    if (decoded && typeof decoded.id === 'string' && typeof decoded.email === 'string') {
      return { id: decoded.id, email: decoded.email };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Create a demo token for a user (base64 JSON).
 */
export function createToken(user: AuthUser): string {
  return Buffer.from(JSON.stringify(user)).toString('base64');
}

/**
 * Demo: get or create a guest user token stored in localStorage.
 * On the server side, we use a default guest for unauthenticated requests
 * to allow the demo to work without login.
 */
export const DEMO_USER: AuthUser = {
  id: 'demo_user_001',
  email: 'demo@nutritrack.app',
};

/**
 * Returns the auth user from the request, falling back to the demo user
 * so the app works without authentication in demo mode.
 */
export function getAuthUserOrDemo(request: NextRequest): AuthUser {
  return getAuthUser(request) ?? DEMO_USER;
}
