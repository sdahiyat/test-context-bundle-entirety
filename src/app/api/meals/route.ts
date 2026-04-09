import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createServiceClient } from '@/lib/supabase'
import { calculateItemNutrition } from '@/lib/nutrition'
import { CreateMealRequest, MealType } from '@/types/nutrition'

const VALID_MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

export async function GET(request: NextRequest) {
  try {
    const supabaseAuth = createRouteHandlerClient({ cookies })
    const { data: { session }, error: sessionError } = await supabaseAuth.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    const mealTypeParam = searchParams.get('meal_type')

    const targetDate = dateParam || new Date().toISOString().split('T')[0]
    const startOfDay = `${targetDate}T00:00:00.000Z`
    const endOfDay = `${targetDate}T23:59:59.999Z`

    const supabaseAdmin = createServiceClient()

    let query = supabaseAdmin
      .from('meals')
      .select(`
        *,
        meal_items (
          *,
          food:foods (*)
        )
      `)
      .eq('user_id', session.user.id)
      .gte('logged_at', startOfDay)
      .lte('logged_at', endOfDay)
      .order('logged_at', { ascending: true })

    if (mealTypeParam && VALID_MEAL_TYPES.includes(mealTypeParam as MealType)) {
      query = query.eq('meal_type', mealTypeParam)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching meals:', error)
      return NextResponse.json({ error: 'Failed to fetch meals' }, { status: 500 })
    }

    return NextResponse.json({ meals: data || [] })
  } catch (err) {
    console.error('Unexpected error fetching meals:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAuth = createRouteHandlerClient({ cookies })
    const { data: { session }, error: sessionError } = await supabaseAuth.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: CreateMealRequest = await request.json()
    const { meal_type, logged_at, notes, items } = body

    if (!meal_type || !VALID_MEAL_TYPES.includes(meal_type)) {
      return NextResponse.json({ error: 'Invalid meal_type' }, { status: 400 })
    }

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'items must be an array' }, { status: 400 })
    }

    const supabaseAdmin = createServiceClient()

    // Insert the meal
    const { data: meal, error: mealError } = await supabaseAdmin
      .from('meals')
      .insert({
        user_id: session.user.id,
        meal_type,
        logged_at: logged_at || new Date().toISOString(),
        notes: notes || null,
        total_calories: 0,
        total_protein_g: 0,
        total_carbs_g: 0,
        total_fat_g: 0,
      })
      .select()
      .single()

    if (mealError || !meal) {
      console.error('Error creating meal:', mealError)
      return NextResponse.json({ error: 'Failed to create meal' }, { status: 500 })
    }

    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0

    // Process each item
    if (items.length > 0) {
      const mealItemsToInsert = []

      for (const item of items) {
        const { data: food, error: foodError } = await supabaseAdmin
          .from('foods')
          .select('*')
          .eq('id', item.food_id)
          .single()

        if (foodError || !food) {
          console.error(`Food not found: ${item.food_id}`)
          continue
        }

        const nutrition = calculateItemNutrition(food, item.quantity_g)
        totalCalories += nutrition.calories
        totalProtein += nutrition.protein_g
        totalCarbs += nutrition.carbs_g
        totalFat += nutrition.fat_g

        mealItemsToInsert.push({
          meal_id: meal.id,
          food_id: item.food_id,
          quantity_g: item.quantity_g,
          calories: nutrition.calories,
          protein_g: nutrition.protein_g,
          carbs_g: nutrition.carbs_g,
          fat_g: nutrition.fat_g,
        })
      }

      if (mealItemsToInsert.length > 0) {
        const { error: itemsError } = await supabaseAdmin
          .from('meal_items')
          .insert(mealItemsToInsert)

        if (itemsError) {
          console.error('Error inserting meal items:', itemsError)
          return NextResponse.json({ error: 'Failed to add meal items' }, { status: 500 })
        }
      }
    }

    // Update meal totals
    const { data: updatedMeal, error: updateError } = await supabaseAdmin
      .from('meals')
      .update({
        total_calories: Math.round(totalCalories * 10) / 10,
        total_protein_g: Math.round(totalProtein * 10) / 10,
        total_carbs_g: Math.round(totalCarbs * 10) / 10,
        total_fat_g: Math.round(totalFat * 10) / 10,
        updated_at: new Date().toISOString(),
      })
      .eq('id', meal.id)
      .select(`
        *,
        meal_items (
          *,
          food:foods (*)
        )
      `)
      .single()

    if (updateError) {
      console.error('Error updating meal totals:', updateError)
      return NextResponse.json({ error: 'Failed to update meal totals' }, { status: 500 })
    }

    return NextResponse.json({ meal: updatedMeal }, { status: 201 })
  } catch (err) {
    console.error('Unexpected error creating meal:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
