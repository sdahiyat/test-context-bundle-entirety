import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
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

    const userId = session.user.id;

    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Fetch meals with meal items and foods
    const { data: meals } = await supabase
      .from('meals')
      .select(
        `
        *,
        meal_items (
          *,
          foods (*)
        )
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Fetch user settings
    const { data: settings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: userId,
        email: session.user.email,
      },
      profile: profile || null,
      meals: meals || [],
      settings: settings || null,
    };

    const date = new Date().toISOString().split('T')[0];
    const fileName = `nutritrack-export-${date}.json`;

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (err) {
    console.error('Unexpected error in GET /api/settings/export-data:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
