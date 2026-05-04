/**
 * In-memory data store for meals and foods (server-side singleton).
 * In production this would be replaced by a real database (MongoDB/Supabase).
 */

export interface MealItem {
  foodId: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Meal {
  id: string;
  userId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  loggedAt: string; // ISO string
  items: MealItem[];
  notes: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  createdAt: string;
  updatedAt: string;
}

export interface Food {
  id: string;
  name: string;
  brand: string;
  barcode?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  source: 'usda' | 'custom' | 'openfoodfacts';
  externalId?: string;
}

export interface UserFoodHistory {
  userId: string;
  foodId: string;
  foodName: string;
  lastUsed: string;
  useCount: number;
  typicalQuantity: number;
  typicalUnit: string;
}

// Server-side singleton stores
const globalStore = global as typeof global & {
  __meals: Map<string, Meal>;
  __foods: Map<string, Food>;
  __foodHistory: Map<string, UserFoodHistory>;
};

if (!globalStore.__meals) globalStore.__meals = new Map<string, Meal>();
if (!globalStore.__foods) globalStore.__foods = new Map<string, Food>();
if (!globalStore.__foodHistory) globalStore.__foodHistory = new Map<string, UserFoodHistory>();

// Seed some sample foods if empty
if (globalStore.__foods.size === 0) {
  const sampleFoods: Food[] = [
    {
      id: 'food_1',
      name: 'Chicken Breast',
      brand: 'Generic',
      servingSize: 100,
      servingUnit: 'g',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      source: 'usda',
    },
    {
      id: 'food_2',
      name: 'Brown Rice',
      brand: 'Generic',
      servingSize: 100,
      servingUnit: 'g',
      calories: 216,
      protein: 4.5,
      carbs: 45,
      fat: 1.8,
      fiber: 3.5,
      sugar: 0.7,
      sodium: 10,
      source: 'usda',
    },
    {
      id: 'food_3',
      name: 'Banana',
      brand: 'Generic',
      servingSize: 1,
      servingUnit: 'medium (118g)',
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      fiber: 3.1,
      sugar: 14,
      sodium: 1,
      source: 'usda',
    },
    {
      id: 'food_4',
      name: 'Whole Milk',
      brand: 'Generic',
      servingSize: 240,
      servingUnit: 'ml',
      calories: 149,
      protein: 8,
      carbs: 12,
      fat: 8,
      fiber: 0,
      sugar: 12,
      sodium: 105,
      source: 'usda',
    },
    {
      id: 'food_5',
      name: 'Scrambled Eggs',
      brand: 'Generic',
      servingSize: 2,
      servingUnit: 'large eggs',
      calories: 182,
      protein: 12,
      carbs: 1.6,
      fat: 14,
      fiber: 0,
      sugar: 1.2,
      sodium: 342,
      source: 'usda',
    },
    {
      id: 'food_6',
      name: 'Oatmeal',
      brand: 'Quaker',
      servingSize: 40,
      servingUnit: 'g',
      calories: 150,
      protein: 5,
      carbs: 27,
      fat: 3,
      fiber: 4,
      sugar: 1,
      sodium: 0,
      source: 'usda',
    },
    {
      id: 'food_7',
      name: 'Greek Yogurt',
      brand: 'Chobani',
      servingSize: 170,
      servingUnit: 'g',
      calories: 100,
      protein: 17,
      carbs: 6,
      fat: 0.7,
      fiber: 0,
      sugar: 4,
      sodium: 65,
      source: 'usda',
    },
    {
      id: 'food_8',
      name: 'Apple',
      brand: 'Generic',
      servingSize: 1,
      servingUnit: 'medium (182g)',
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      fiber: 4.4,
      sugar: 19,
      sodium: 2,
      source: 'usda',
    },
    {
      id: 'food_9',
      name: 'Salmon Fillet',
      brand: 'Generic',
      servingSize: 100,
      servingUnit: 'g',
      calories: 208,
      protein: 20,
      carbs: 0,
      fat: 13,
      fiber: 0,
      sugar: 0,
      sodium: 59,
      source: 'usda',
    },
    {
      id: 'food_10',
      name: 'Broccoli',
      brand: 'Generic',
      servingSize: 100,
      servingUnit: 'g',
      calories: 34,
      protein: 2.8,
      carbs: 7,
      fat: 0.4,
      fiber: 2.6,
      sugar: 1.7,
      sodium: 33,
      source: 'usda',
    },
    {
      id: 'food_11',
      name: 'Whole Wheat Bread',
      brand: 'Generic',
      servingSize: 1,
      servingUnit: 'slice (28g)',
      calories: 69,
      protein: 3.6,
      carbs: 12,
      fat: 1,
      fiber: 1.9,
      sugar: 1.4,
      sodium: 132,
      source: 'usda',
    },
    {
      id: 'food_12',
      name: 'Peanut Butter',
      brand: 'Jif',
      servingSize: 2,
      servingUnit: 'tbsp (32g)',
      calories: 190,
      protein: 7,
      carbs: 8,
      fat: 16,
      fiber: 2,
      sugar: 3,
      sodium: 140,
      source: 'usda',
    },
  ];

  sampleFoods.forEach((f) => globalStore.__foods.set(f.id, f));
}

export const mealsStore = globalStore.__meals;
export const foodsStore = globalStore.__foods;
export const foodHistoryStore = globalStore.__foodHistory;

// Utility: compute totals from items
export function computeTotals(items: MealItem[]) {
  return items.reduce(
    (acc, item) => ({
      totalCalories: acc.totalCalories + (item.calories || 0),
      totalProtein: acc.totalProtein + (item.protein || 0),
      totalCarbs: acc.totalCarbs + (item.carbs || 0),
      totalFat: acc.totalFat + (item.fat || 0),
      totalFiber: acc.totalFiber + (item.fiber || 0),
    }),
    { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, totalFiber: 0 }
  );
}

// Utility: generate simple IDs
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Food history helpers
export function incrementFoodUsage(
  userId: string,
  foodId: string,
  foodName: string,
  quantity: number,
  unit: string
) {
  const key = `${userId}__${foodId}`;
  const existing = foodHistoryStore.get(key);
  if (existing) {
    existing.useCount += 1;
    existing.lastUsed = new Date().toISOString();
    existing.typicalQuantity = quantity;
    existing.typicalUnit = unit;
  } else {
    foodHistoryStore.set(key, {
      userId,
      foodId,
      foodName,
      lastUsed: new Date().toISOString(),
      useCount: 1,
      typicalQuantity: quantity,
      typicalUnit: unit,
    });
  }
}
