import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createServiceClient } from '@/lib/supabase'
import { calculateItemNutrition } from '@/lib/nutrition'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseAuth = createRouteHandlerClient({ cookies })
    const { data: { session }, error: sessionError } = await supabaseAuth.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseAdmin = createServiceClient()

    // Verify meal ownership
    const { data: meal, error: mealError } = await supabaseAdmin
      .from('meals')
      .select('id, user_id')
      .eq('id', params.id)
      .single()

    if (mealError || !meal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    if (meal.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body: { food_id: string; quantity_g: number } = await request.json()
    const { food_id, quantity_g } = body

    if (!food_id || !quantity_g || quantity_g <= 0) {
      return NextResponse.json({ error: 'Invalid food_id or quantity_g' }, { status: 400 })
    }

    // Fetch food
    const { data: food, error: foodError } = await supabaseAdmin
      .from('foods')
      .select('*')
      .eq('id', food_id)
      .single()

    if (foodError || !food) {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 })
    }

    const nutrition = calculateItemNutrition(food, quantity_g)

    // Insert meal item
    const { data: newItem, error: insertError } = await supabaseAdmin
      .from('meal_items')
      .insert({
        meal_id: params.id,
        food_id,
        quantity_g,
        calories: nutrition.calories,
        protein_g: nutrition.protein_g,
        carbs_g: nutrition.carbs_g,
        fat_g: nutrition.fat_g,
      })
      .select(`*, food:foods(*)`)
      .single()

    if (insertError || !newItem) {
      console.error('Error inserting meal item:', insertError)
      return NextResponse.json({ error: 'Failed to add item' }, { status: 500 })
    }

    // Recalculate meal totals
    const { data: allItems, error: itemsError } = await supabaseAdmin
      .from('meal_items')
      .select('calories, protein_g, carbs_g, fat_g')
      .eq('meal_id', params.id)

    if (itemsError) {
      console.error('Error fetching meal items for totals:', itemsError)
      return NextResponse.json({ error: 'Failed to recalculate totals' }, { status: 500 })
    }

    const totals = (allItems || []).reduce(
      (acc, item) => ({
        total_calories: acc.total_calories + item.calories,
        total_protein_g: acc.total_protein_g + item.protein_g,
        total_carbs_g: acc.total_carbs_g + item.carbs_g,
        total_fat_g: acc.total_fat_g + item.fat_g,
      }),
      { total_calories: 0, total_protein_g: 0, total_carbs_g: 0, total_fat_g: 0 }
    )

    const { data: updatedMeal, error: updateError } = await supabaseAdmin
      .from('meals')
      .update({
        ...totals,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select(`*, meal_items(*, food:foods(*))`)
      .single()

    if (updateError) {
      console.error('Error updating meal totals:', updateError)
      return NextResponse.json({ error: 'Failed to update meal totals' }, { status: 500 })
    }

    return NextResponse.json({ item: newItem, meal: updatedMeal }, { status: 201 })
  } catch (err) {
    console.error('Unexpected error adding meal item:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
