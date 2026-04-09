import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createServiceClient } from '@/lib/supabase'
import { Food } from '@/types/nutrition'

export async function GET(_request: NextRequest) {
  try {
    const supabaseAuth = createRouteHandlerClient({ cookies })
    const { data: { session }, error: sessionError } = await supabaseAuth.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseAdmin = createServiceClient()

    // Fetch all meal items belonging to user's meals
    const { data: userMealItems, error } = await supabaseAdmin
      .from('meal_items')
      .select(`
        food_id,
        food:foods (*),
        meal:meals!inner (user_id)
      `)
      .eq('meals.user_id', session.user.id)
      .limit(500)

    if (error) {
      console.error('Error fetching frequent foods:', error)
      return NextResponse.json({ error: 'Failed to fetch frequent foods' }, { status: 500 })
    }

    // Count occurrences per food_id
    const foodCounts = new Map<string, { food: Food; count: number }>()

    for (const item of (userMealItems || [])) {
      if (!item.food) continue
      const existing = foodCounts.get(item.food_id)
      if (existing) {
        existing.count++
      } else {
        foodCounts.set(item.food_id, { food: item.food as Food, count: 1 })
      }
    }

    // Sort by count descending and take top 10
    const sortedFoods = Array.from(foodCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((entry) => entry.food)

    return NextResponse.json({ foods: sortedFoods })
  } catch (err) {
    console.error('Unexpected error fetching frequent foods:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
