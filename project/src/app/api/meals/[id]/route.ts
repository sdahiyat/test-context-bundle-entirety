import { NextRequest, NextResponse } from 'next/server';
import {
  mealsStore,
  computeTotals,
  incrementFoodUsage,
  type MealItem,
} from '@/lib/store';
import { getAuthUserOrDemo } from '@/lib/auth';

// GET /api/meals/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getAuthUserOrDemo(request);
  const meal = mealsStore.get(params.id);

  if (!meal) {
    return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
  }
  if (meal.userId !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  return NextResponse.json(meal);
}

// PUT /api/meals/:id — update meal
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getAuthUserOrDemo(request);
  const meal = mealsStore.get(params.id);

  if (!meal) {
    return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
  }
  if (meal.userId !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  let body: {
    mealType?: string;
    loggedAt?: string;
    items?: MealItem[];
    notes?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { mealType, loggedAt, items, notes } = body;

  if (
    mealType &&
    !['breakfast', 'lunch', 'dinner', 'snack'].includes(mealType)
  ) {
    return NextResponse.json(
      { error: 'mealType must be one of: breakfast, lunch, dinner, snack' },
      { status: 400 }
    );
  }

  const updatedItems = items !== undefined ? items : meal.items;

  if (updatedItems.length === 0) {
    return NextResponse.json(
      { error: 'items must be a non-empty array' },
      { status: 400 }
    );
  }

  const totals = computeTotals(updatedItems);
  const updated = {
    ...meal,
    mealType: (mealType as typeof meal.mealType) || meal.mealType,
    loggedAt: loggedAt || meal.loggedAt,
    items: updatedItems,
    notes: notes !== undefined ? notes : meal.notes,
    ...totals,
    updatedAt: new Date().toISOString(),
  };

  mealsStore.set(updated.id, updated);

  // Track food usage history for new items
  if (items) {
    for (const item of items) {
      incrementFoodUsage(user.id, item.foodId || item.foodName, item.foodName, item.quantity, item.unit);
    }
  }

  return NextResponse.json(updated);
}

// DELETE /api/meals/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getAuthUserOrDemo(request);
  const meal = mealsStore.get(params.id);

  if (!meal) {
    return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
  }
  if (meal.userId !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  mealsStore.delete(params.id);

  return NextResponse.json({ success: true, id: params.id });
}
