import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No row found
        return NextResponse.json({ data: null, error: 'Profile not found' }, { status: 404 })
      }
      return NextResponse.json({ data: null, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: profile, error: null })
  } catch (err) {
    console.error('GET /api/profile error:', err)
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Whitelist allowed fields
    const allowedFields = [
      'full_name',
      'date_of_birth',
      'sex',
      'height_cm',
      'weight_kg',
      'activity_level',
      'goal_type',
      'target_calories',
      'target_protein_g',
      'target_carbs_g',
      'target_fat_g',
      'onboarding_completed',
    ]

    const updateData: Record<string, unknown> = { user_id: user.id }
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .upsert(updateData, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: profile, error: null })
  } catch (err) {
    console.error('PATCH /api/profile error:', err)
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 })
  }
}
