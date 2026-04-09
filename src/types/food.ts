/**
 * Shared TypeScript types for food-related data.
 * Used across the food search API, UI components, and meal logging.
 */

export interface Food {
  id: string;
  name: string;
  serving_size: number;
  serving_unit: string;
  calories_per_serving: number;
  protein_per_serving: number;
  carbs_per_serving: number;
  fat_per_serving: number;
  category: string;
  created_at?: string;
}

/**
 * FoodSearchResult is the shape returned by the /api/foods/search endpoint.
 * It is equivalent to Food but with created_at optional since the API
 * selects only the columns needed for display.
 */
export interface FoodSearchResult extends Food {}

/**
 * Union type for all supported food categories.
 */
export type FoodCategory =
  | 'protein'
  | 'dairy'
  | 'grain'
  | 'fruit'
  | 'vegetable'
  | 'nut'
  | 'fat'
  | 'legume'
  | 'snack'
  | 'beverage';

/**
 * All food categories as an ordered array, suitable for populating
 * filter dropdowns and category pickers.
 */
export const FOOD_CATEGORIES: FoodCategory[] = [
  'protein',
  'dairy',
  'grain',
  'fruit',
  'vegetable',
  'nut',
  'fat',
  'legume',
  'snack',
  'beverage',
];

/**
 * Human-readable labels for each food category.
 */
export const FOOD_CATEGORY_LABELS: Record<FoodCategory, string> = {
  protein: 'Protein',
  dairy: 'Dairy',
  grain: 'Grains',
  fruit: 'Fruit',
  vegetable: 'Vegetable',
  nut: 'Nuts & Seeds',
  fat: 'Fats & Oils',
  legume: 'Legumes',
  snack: 'Snacks',
  beverage: 'Beverages',
};
