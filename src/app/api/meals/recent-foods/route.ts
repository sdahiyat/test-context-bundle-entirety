import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createServiceClient } from '@/lib/supabase'

export async function GET(_request: NextRequest) {
  try {
    const supabaseAuth = createRouteHandlerClient({ cookies })
    const { data: { session }, error: sessionError } = await supabaseAuth.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseAdmin = createServiceClient()

    // Fetch recent meal items with food data, ordered by most recent
    const { data, error } = await supabaseAdmin
      .from('meal_items')
      .select(`
        food_id,
        created_at,
        food:foods (*)
      `)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching recent foods:', error)
      return NextResponse.json({ error: 'Failed to fetch recent foods' }, { status: 500 })
    }

    // We need to filter by user's meals - use a join approach
    const { data: userMealItems, error: userItemsError } = await supabaseAdmin
      .from('meal_items')
      .select(`
        food_id,
        created_at,
        food:foods (*),
        meal:meals!inner (user_id)
      `)
      .eq('meals.user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (userItemsError) {
      console.error('Error fetching user recent foods:', userItemsError)
      return NextResponse.json({ error: 'Failed to fetch recent foods' }, { status: 500 })
    }

    // Deduplicate by food_id, keeping most recent
    const seen = new Set<string>()
    const uniqueFoods = []

    for (const item of (userMealItems || [])) {
      if (!seen.has(item.food_id)) {
        seen.add(item.food_id)
        uniqueFoods.push(item.food)
        if (uniqueFoods.length >= 10) break
      }
    }

    return NextResponse.json({ foods: uniqueFoods })
  } catch (err) {
    console.error('Unexpected error fetching recent foods:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
