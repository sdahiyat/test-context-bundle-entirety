import { Food, Meal, MealType, NutritionSummary } from '@/types/nutrition'

export function calculateItemNutrition(food: Food, quantity_g: number): NutritionSummary {
  const ratio = quantity_g / food.serving_size_g
  return {
    calories: Math.round((food.calories_per_serving * ratio) * 10) / 10,
    protein_g: Math.round((food.protein_g * ratio) * 10) / 10,
    carbs_g: Math.round((food.carbs_g * ratio) * 10) / 10,
    fat_g: Math.round((food.fat_g * ratio) * 10) / 10,
  }
}

export function calculateMealTotals(
  items: Array<{ food: Food; quantity_g: number }>
): NutritionSummary {
  return items.reduce(
    (totals, item) => {
      const nutrition = calculateItemNutrition(item.food, item.quantity_g)
      return {
        calories: Math.round((totals.calories + nutrition.calories) * 10) / 10,
        protein_g: Math.round((totals.protein_g + nutrition.protein_g) * 10) / 10,
        carbs_g: Math.round((totals.carbs_g + nutrition.carbs_g) * 10) / 10,
        fat_g: Math.round((totals.fat_g + nutrition.fat_g) * 10) / 10,
      }
    },
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  )
}

export function calculateDailyTotals(meals: Meal[]): NutritionSummary {
  return meals.reduce(
    (totals, meal) => ({
      calories: Math.round((totals.calories + meal.total_calories) * 10) / 10,
      protein_g: Math.round((totals.protein_g + meal.total_protein_g) * 10) / 10,
      carbs_g: Math.round((totals.carbs_g + meal.total_carbs_g) * 10) / 10,
      fat_g: Math.round((totals.fat_g + meal.total_fat_g) * 10) / 10,
    }),
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  )
}

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}

export function getMealTypeOrder(type: MealType): number {
  const order: Record<MealType, number> = {
    breakfast: 0,
    lunch: 1,
    dinner: 2,
    snack: 3,
  }
  return order[type]
}
