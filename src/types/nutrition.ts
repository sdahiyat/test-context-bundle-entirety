export interface Food {
  id: string
  name: string
  brand?: string
  serving_size_g: number
  calories_per_serving: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g?: number
  sugar_g?: number
  sodium_mg?: number
  is_verified: boolean
  created_by?: string
  created_at?: string
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface MealItem {
  id: string
  meal_id: string
  food_id: string
  food?: Food
  quantity_g: number
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  created_at?: string
}

export interface Meal {
  id: string
  user_id: string
  meal_type: MealType
  logged_at: string
  notes?: string
  total_calories: number
  total_protein_g: number
  total_carbs_g: number
  total_fat_g: number
  meal_items?: MealItem[]
  created_at: string
  updated_at: string
}

export interface CreateMealRequest {
  meal_type: MealType
  logged_at?: string
  notes?: string
  items: Array<{
    food_id: string
    quantity_g: number
  }>
}

export interface UpdateMealRequest {
  meal_type?: MealType
  logged_at?: string
  notes?: string
}

export interface NutritionSummary {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

export interface UserGoals {
  target_calories: number
  target_protein_g: number
  target_carbs_g: number
  target_fat_g: number
}
