import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ foods: [] })
    }

    const supabaseAdmin = createServiceClient()

    const { data, error } = await supabaseAdmin
      .from('foods')
      .select('*')
      .ilike('name', `%${q.trim()}%`)
      .limit(20)
      .order('name', { ascending: true })

    if (error) {
      console.error('Food search error:', error)
      return NextResponse.json({ error: 'Failed to search foods' }, { status: 500 })
    }

    return NextResponse.json({ foods: data || [] })
  } catch (err) {
    console.error('Unexpected error in food search:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
