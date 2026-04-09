import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabaseAdmin = createServiceClient()

    const { data, error } = await supabaseAdmin
      .from('foods')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 })
    }

    return NextResponse.json({ food: data })
  } catch (err) {
    console.error('Unexpected error fetching food:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
