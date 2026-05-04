import { NextRequest, NextResponse } from 'next/server';
import { foodsStore } from '@/lib/store';

// GET /api/foods/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const food = foodsStore.get(params.id);

  if (!food) {
    return NextResponse.json({ error: 'Food not found' }, { status: 404 });
  }

  return NextResponse.json(food);
}
