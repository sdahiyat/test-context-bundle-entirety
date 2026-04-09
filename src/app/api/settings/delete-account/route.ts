import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function DELETE() {
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

    // Delete meal_items linked to user's meals
    const { data: userMeals } = await supabaseAdmin
      .from('meals')
      .select('id')
      .eq('user_id', userId);

    if (userMeals && userMeals.length > 0) {
      const mealIds = userMeals.map((m: { id: string }) => m.id);
      const { error: mealItemsError } = await supabaseAdmin
        .from('meal_items')
        .delete()
        .in('meal_id', mealIds);

      if (mealItemsError) {
        console.error('Error deleting meal items:', mealItemsError);
        return NextResponse.json({ error: 'Failed to delete meal data' }, { status: 500 });
      }
    }

    // Delete meals
    const { error: mealsError } = await supabaseAdmin
      .from('meals')
      .delete()
      .eq('user_id', userId);

    if (mealsError) {
      console.error('Error deleting meals:', mealsError);
      return NextResponse.json({ error: 'Failed to delete meal data' }, { status: 500 });
    }

    // Delete user settings
    const { error: settingsError } = await supabaseAdmin
      .from('user_settings')
      .delete()
      .eq('user_id', userId);

    if (settingsError) {
      console.error('Error deleting user settings:', settingsError);
      // Non-fatal, continue
    }

    // Delete profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Error deleting profile:', profileError);
      // Non-fatal, continue
    }

    // Delete the auth user (must be last)
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      console.error('Error deleting auth user:', deleteUserError);
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Unexpected error in DELETE /api/settings/delete-account:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
