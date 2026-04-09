import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export type { FoodSearchResult } from '@/types/food';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') ?? '';
    const category = searchParams.get('category') ?? '';

    // Require at least 2 characters to avoid overly broad queries
    if (q.trim().length < 2) {
      return NextResponse.json({ foods: [] });
    }

    const supabase = createServiceClient();

    let query = supabase
      .from('foods')
      .select(
        'id, name, serving_size, serving_unit, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving, category'
      )
      .ilike('name', `%${q.trim()}%`)
      .order('name')
      .limit(20);

    if (category && category.trim() !== '') {
      query = query.eq('category', category.trim());
    }

    const { data, error } = await query;

    if (error) {
      console.error('[/api/foods/search] Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ foods: data ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[/api/foods/search] Unexpected error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
