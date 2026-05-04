import { NextRequest, NextResponse } from 'next/server';
import { foodsStore, type Food } from '@/lib/store';

interface NormalizedFood {
  id: string;
  name: string;
  brand: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  source: string;
}

function normalizeFood(food: Food): NormalizedFood {
  return {
    id: food.id,
    name: food.name,
    brand: food.brand || '',
    servingSize: food.servingSize,
    servingUnit: food.servingUnit,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    fiber: food.fiber,
    source: food.source,
  };
}

function normalizeOpenFoodFacts(product: Record<string, unknown>): NormalizedFood | null {
  const name = (product.product_name as string) || (product.product_name_en as string);
  if (!name) return null;

  const nutriments = (product.nutriments as Record<string, number>) || {};

  return {
    id: `off_${product.id || product._id || Math.random().toString(36).slice(2)}`,
    name,
    brand: (product.brands as string) || '',
    servingSize: parseFloat(String(product.serving_quantity || product.serving_size || '100')) || 100,
    servingUnit: (product.serving_size_unit as string) || 'g',
    calories: nutriments['energy-kcal_serving'] || nutriments['energy-kcal_100g'] || 0,
    protein: nutriments['proteins_serving'] || nutriments['proteins_100g'] || 0,
    carbs: nutriments['carbohydrates_serving'] || nutriments['carbohydrates_100g'] || 0,
    fat: nutriments['fat_serving'] || nutriments['fat_100g'] || 0,
    fiber: nutriments['fiber_serving'] || nutriments['fiber_100g'] || 0,
    source: 'openfoodfacts',
  };
}

// GET /api/foods/search?q=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const queryLower = q.toLowerCase();

  // Search local food store
  const localResults: NormalizedFood[] = Array.from(foodsStore.values())
    .filter(
      (f) =>
        f.name.toLowerCase().includes(queryLower) ||
        (f.brand && f.brand.toLowerCase().includes(queryLower))
    )
    .map(normalizeFood);

  // Fetch from OpenFoodFacts in parallel
  let offResults: NormalizedFood[] = [];
  try {
    const offUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&json=1&page_size=10&fields=id,product_name,product_name_en,brands,serving_size,serving_quantity,nutriments`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

    const offResponse = await fetch(offUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (offResponse.ok) {
      const offData = (await offResponse.json()) as { products?: Record<string, unknown>[] };
      if (offData.products && Array.isArray(offData.products)) {
        offResults = offData.products
          .map(normalizeOpenFoodFacts)
          .filter((f): f is NormalizedFood => f !== null);
      }
    }
  } catch {
    // Ignore fetch errors — return local results only
  }

  // Merge and deduplicate by name+brand
  const seen = new Set<string>();
  const merged: NormalizedFood[] = [];

  for (const food of [...localResults, ...offResults]) {
    const key = `${food.name.toLowerCase()}|${food.brand.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(food);
    }
  }

  return NextResponse.json({ results: merged.slice(0, 20) });
}
