import { NextRequest, NextResponse } from 'next/server';
import {
  mealsStore,
  computeTotals,
  generateId,
  incrementFoodUsage,
  type Meal,
  type MealItem,
} from '@/lib/store';
import { getAuthUserOrDemo } from '@/lib/auth';

// GET /api/meals — list meals with optional filters
export async function GET(request: NextRequest) {
  const user = getAuthUserOrDemo(request);
  const { searchParams } = new URL(request.url);

  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const mealType = searchParams.get('mealType');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  let meals = Array.from(mealsStore.values()).filter((m) => m.userId === user.id);

  if (startDate) {
    const start = new Date(startDate).getTime();
    meals = meals.filter((m) => new Date(m.loggedAt).getTime() >= start);
  }
  if (endDate) {
    const end = new Date(endDate).getTime();
    meals = meals.filter((m) => new Date(m.loggedAt).getTime() <= end);
  }
  if (mealType) {
    meals = meals.filter((m) => m.mealType === mealType);
  }

  // Sort by loggedAt descending
  meals.sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());

  const total = meals.length;
  const offset = (page - 1) * limit;
  const paginated = meals.slice(offset, offset + limit);

  return NextResponse.json({
    meals: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

// POST /api/meals — create a new meal
export async function POST(request: NextRequest) {
  const user = getAuthUserOrDemo(request);

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

  // Validate required fields
  if (!mealType || !['breakfast', 'lunch', 'dinner', 'snack'].includes(mealType)) {
    return NextResponse.json(
      { error: 'mealType is required and must be one of: breakfast, lunch, dinner, snack' },
      { status: 400 }
    );
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: 'items is required and must be a non-empty array' },
      { status: 400 }
    );
  }

  // Validate each item
  for (const item of items) {
    if (!item.foodName || typeof item.quantity !== 'number' || item.quantity <= 0) {
      return NextResponse.json(
        { error: 'Each item must have foodName and a positive quantity' },
        { status: 400 }
      );
    }
  }

  const totals = computeTotals(items);
  const now = new Date().toISOString();
  const meal: Meal = {
    id: generateId('meal'),
    userId: user.id,
    mealType: mealType as Meal['mealType'],
    loggedAt: loggedAt || now,
    items,
    notes: notes || '',
    ...totals,
    createdAt: now,
    updatedAt: now,
  };

  mealsStore.set(meal.id, meal);

  // Track food usage history
  for (const item of items) {
    incrementFoodUsage(user.id, item.foodId || item.foodName, item.foodName, item.quantity, item.unit);
  }

  return NextResponse.json(meal, { status: 201 });
}
