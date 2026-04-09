import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createServiceClient } from '@/lib/supabase'
import { calculateItemNutrition } from '@/lib/nutrition'

async function verifyMealOwnership(
  supabaseAdmin: ReturnType<typeof createServiceClient>,
  mealId: string,
  userId: string
): Promise<boolean> {
  const { data: meal, error } = await supabaseAdmin
    .from('meals')
    .select('id, user_id')
    .eq('id', mealId)
    .single()

  if (error || !meal) return false
  return meal.user_id === userId
}

async function recalculateMealTotals(
  supabaseAdmin: ReturnType<typeof createServiceClient>,
  mealId: string
) {
  const { data: allItems } = await supabaseAdmin
    .from('meal_items')
    .select('calories, protein_g, carbs_g, fat_g')
    .eq('meal_id', mealId)

  const totals = (allItems || []).reduce(
    (acc, item) => ({
      total_calories: acc.total_calories + item.calories,
      total_protein_g: acc.total_protein_g + item.protein_g,
      total_carbs_g: acc.total_carbs_g + item.carbs_g,
      total_fat_g: acc.total_fat_g + item.fat_g,
    }),
    { total_calories: 0, total_protein_g: 0, total_carbs_g: 0, total_fat_g: 0 }
  )

  const { data: updatedMeal, error } = await supabaseAdmin
    .from('meals')
    .update({
      ...totals,
      updated_at: new Date().toISOString(),
    })
    .eq('id', mealId)
    .select(`*, meal_items(*, food:foods(*))`)
    .single()

  return { updatedMeal, error }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const supabaseAuth = createRouteHandlerClient({ cookies })
    const { data: { session }, error: sessionError } = await supabaseAuth.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseAdmin = createServiceClient()

    const isOwner = await verifyMealOwnership(supabaseAdmin, params.id, session.user.id)
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body: { quantity_g: number } = await request.json()
    const { quantity_g } = body

    if (!quantity_g || quantity_g <= 0) {
      return NextResponse.json({ error: 'Invalid quantity_g' }, { status: 400 })
    }

    // Get the item with food data
    const { data: item, error: itemError } = await supabaseAdmin
      .from('meal_items')
      .select(`*, food:foods(*)`)
      .eq('id', params.itemId)
      .eq('meal_id', params.id)
      .single()

    if (itemError || !item) {
      return NextResponse.json({ error: 'Meal item not found' }, { status: 404 })
    }

    const nutrition = calculateItemNutrition(item.food, quantity_g)

    await supabaseAdmin
      .from('meal_items')
      .update({
        quantity_g,
        calories: nutrition.calories,
        protein_g: nutrition.protein_g,
        carbs_g: nutrition.carbs_g,
        fat_g: nutrition.fat_g,
      })
      .eq('id', params.itemId)

    const { updatedMeal, error: updateError } = await recalculateMealTotals(supabaseAdmin, params.id)

    if (updateError) {
      console.error('Error updating meal totals:', updateError)
      return NextResponse.json({ error: 'Failed to update meal' }, { status: 500 })
    }

    return NextResponse.json({ meal: updatedMeal })
  } catch (err) {
    console.error('Unexpected error updating meal item:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const supabaseAuth = createRouteHandlerClient({ cookies })
    const { data: { session }, error: sessionError } = await supabaseAuth.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseAdmin = createServiceClient()

    const isOwner = await verifyMealOwnership(supabaseAdmin, params.id, session.user.id)
    if (!isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error: deleteError } = await supabaseAdmin
      .from('meal_items')
      .delete()
      .eq('id', params.itemId)
      .eq('meal_id', params.id)

    if (deleteError) {
      console.error('Error deleting meal item:', deleteError)
      return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
    }

    const { updatedMeal, error: updateError } = await recalculateMealTotals(supabaseAdmin, params.id)

    if (updateError) {
      console.error('Error updating meal totals:', updateError)
      return NextResponse.json({ error: 'Failed to update meal totals' }, { status: 500 })
    }

    return NextResponse.json({ meal: updatedMeal })
  } catch (err) {
    console.error('Unexpected error deleting meal item:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
