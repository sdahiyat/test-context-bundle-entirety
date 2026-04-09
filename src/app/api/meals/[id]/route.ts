import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createServiceClient } from '@/lib/supabase'
import { UpdateMealRequest, MealType } from '@/types/nutrition'

const VALID_MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseAuth = createRouteHandlerClient({ cookies })
    const { data: { session }, error: sessionError } = await supabaseAuth.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseAdmin = createServiceClient()

    const { data: meal, error } = await supabaseAdmin
      .from('meals')
      .select(`
        *,
        meal_items (
          *,
          food:foods (*)
        )
      `)
      .eq('id', params.id)
      .single()

    if (error || !meal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    if (meal.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ meal })
  } catch (err) {
    console.error('Unexpected error fetching meal:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
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

    // Verify ownership
    const { data: existingMeal, error: fetchError } = await supabaseAdmin
      .from('meals')
      .select('id, user_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingMeal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    if (existingMeal.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body: UpdateMealRequest = await request.json()
    const updateData: Partial<UpdateMealRequest & { updated_at: string }> = {
      updated_at: new Date().toISOString(),
    }

    if (body.meal_type !== undefined) {
      if (!VALID_MEAL_TYPES.includes(body.meal_type)) {
        return NextResponse.json({ error: 'Invalid meal_type' }, { status: 400 })
      }
      updateData.meal_type = body.meal_type
    }

    if (body.logged_at !== undefined) {
      updateData.logged_at = body.logged_at
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes
    }

    const { data: updatedMeal, error: updateError } = await supabaseAdmin
      .from('meals')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        meal_items (
          *,
          food:foods (*)
        )
      `)
      .single()

    if (updateError) {
      console.error('Error updating meal:', updateError)
      return NextResponse.json({ error: 'Failed to update meal' }, { status: 500 })
    }

    return NextResponse.json({ meal: updatedMeal })
  } catch (err) {
    console.error('Unexpected error updating meal:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseAuth = createRouteHandlerClient({ cookies })
    const { data: { session }, error: sessionError } = await supabaseAuth.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseAdmin = createServiceClient()

    // Verify ownership
    const { data: existingMeal, error: fetchError } = await supabaseAdmin
      .from('meals')
      .select('id, user_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingMeal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    if (existingMeal.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error: deleteError } = await supabaseAdmin
      .from('meals')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Error deleting meal:', deleteError)
      return NextResponse.json({ error: 'Failed to delete meal' }, { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('Unexpected error deleting meal:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
