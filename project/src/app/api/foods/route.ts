import { NextRequest, NextResponse } from 'next/server';
import { foodsStore, generateId, type Food } from '@/lib/store';
import { getAuthUserOrDemo } from '@/lib/auth';

// GET /api/foods — list all foods
export async function GET(_request: NextRequest) {
  const foods = Array.from(foodsStore.values());
  return NextResponse.json({ foods });
}

// POST /api/foods — create custom food
export async function POST(request: NextRequest) {
  getAuthUserOrDemo(request); // auth check

  let body: Partial<Food>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const requiredFields = ['name', 'servingSize', 'servingUnit', 'calories'] as const;
  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  const food: Food = {
    id: generateId('food'),
    name: body.name!,
    brand: body.brand || '',
    barcode: body.barcode,
    servingSize: Number(body.servingSize),
    servingUnit: body.servingUnit!,
    calories: Number(body.calories) || 0,
    protein: Number(body.protein) || 0,
    carbs: Number(body.carbs) || 0,
    fat: Number(body.fat) || 0,
    fiber: Number(body.fiber) || 0,
    sugar: Number(body.sugar) || 0,
    sodium: Number(body.sodium) || 0,
    source: 'custom',
    externalId: body.externalId,
  };

  foodsStore.set(food.id, food);

  return NextResponse.json(food, { status: 201 });
}
