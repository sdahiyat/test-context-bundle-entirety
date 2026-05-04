import { NextRequest, NextResponse } from 'next/server';
import { foodHistoryStore, foodsStore } from '@/lib/store';
import { getAuthUserOrDemo } from '@/lib/auth';

// GET /api/foods/recent — recent foods for the authenticated user
export async function GET(request: NextRequest) {
  const user = getAuthUserOrDemo(request);

  const history = Array.from(foodHistoryStore.values())
    .filter((h) => h.userId === user.id)
    .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
    .slice(0, 10);

  // Enrich with food details
  const results = history.map((h) => {
    const food = foodsStore.get(h.foodId);
    return {
      foodId: h.foodId,
      foodName: h.foodName,
      lastUsed: h.lastUsed,
      useCount: h.useCount,
      typicalQuantity: h.typicalQuantity,
      typicalUnit: h.typicalUnit,
      food: food || null,
    };
  });

  return NextResponse.json({ recent: results });
}
