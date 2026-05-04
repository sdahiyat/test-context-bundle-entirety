import { NextRequest, NextResponse } from 'next/server';
import { mealsStore } from '@/lib/store';
import { getAuthUserOrDemo } from '@/lib/auth';

// GET /api/meals/summary/daily?startDate=...&endDate=...
export async function GET(request: NextRequest) {
  const user = getAuthUserOrDemo(request);
  const { searchParams } = new URL(request.url);

  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  let meals = Array.from(mealsStore.values()).filter((m) => m.userId === user.id);

  if (startDate) {
    const start = new Date(startDate).getTime();
    meals = meals.filter((m) => new Date(m.loggedAt).getTime() >= start);
  }
  if (endDate) {
    const end = new Date(endDate).getTime();
    meals = meals.filter((m) => new Date(m.loggedAt).getTime() <= end);
  }

  // Group by date (YYYY-MM-DD)
  const byDate: Record<
    string,
    {
      date: string;
      totalCalories: number;
      totalProtein: number;
      totalCarbs: number;
      totalFat: number;
      totalFiber: number;
      mealCount: number;
    }
  > = {};

  for (const meal of meals) {
    const date = meal.loggedAt.slice(0, 10); // YYYY-MM-DD
    if (!byDate[date]) {
      byDate[date] = {
        date,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalFiber: 0,
        mealCount: 0,
      };
    }
    byDate[date].totalCalories += meal.totalCalories;
    byDate[date].totalProtein += meal.totalProtein;
    byDate[date].totalCarbs += meal.totalCarbs;
    byDate[date].totalFat += meal.totalFat;
    byDate[date].totalFiber += meal.totalFiber;
    byDate[date].mealCount += 1;
  }

  const summary = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));

  return NextResponse.json({ summary });
}
