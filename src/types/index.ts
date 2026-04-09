import type { Meal, MealItem } from '@/lib/supabase/types';

// Re-export base DB types for convenience
export type { Meal, MealItem } from '@/lib/supabase/types';

// ============================================================
// Application-level composed / UI types
// ============================================================

/** A meal with its associated items eagerly loaded */
export type MealWithItems = Meal & {
  meal_items: MealItem[];
};

/** Aggregated nutrition for a single calendar day */
export type DailyNutritionSummary = {
  date: string;
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  meals: MealWithItems[];
};

/** Progress towards each macro/calorie goal (0-100+ %) */
export type NutritionGoalProgress = {
  calories: { current: number; goal: number; percentage: number };
  protein:  { current: number; goal: number; percentage: number };
  carbs:    { current: number; goal: number; percentage: number };
  fat:      { current: number; goal: number; percentage: number };
};

/** Subset of profile fields representing a user's nutrition goals */
export type UserGoals = {
  dailyCalorieGoal:  number;
  dailyProteinGoalG: number;
  dailyCarbsGoalG:   number;
  dailyFatGoalG:     number;
  goalType: 'weight_loss' | 'maintenance' | 'muscle_gain';
};

/** Structured output from the AI photo-analysis pipeline */
export type AIFoodAnalysis = {
  foods: Array<{
    name: string;
    estimatedWeightG: number;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    confidence: number;
  }>;
  totalCalories: number;
  notes: string;
};
