import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: Record<string, unknown>) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: Record<string, unknown>) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { newEmail } = body as { newEmail: string };

    if (!newEmail || typeof newEmail !== 'string') {
      return NextResponse.json({ error: 'New email is required' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(newEmail.trim())) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (newEmail.trim().toLowerCase() === session.user.email?.toLowerCase()) {
      return NextResponse.json(
        { error: 'New email must be different from current email' },
        { status: 400 }
      );
    }

    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });

    if (error) {
      console.error('Error updating email:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message:
        'Confirmation email sent. Please check your new email address to confirm the change.',
    });
  } catch (err) {
    console.error('Unexpected error in POST /api/settings/update-email:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
