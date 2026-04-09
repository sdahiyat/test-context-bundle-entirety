// ============================================================
// Database Types — generated from schema
// ============================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          date_of_birth: string | null;
          gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
          height_cm: number | null;
          weight_kg: number | null;
          activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
          goal_type: 'weight_loss' | 'maintenance' | 'muscle_gain';
          daily_calorie_goal: number;
          daily_protein_goal_g: number;
          daily_carbs_goal_g: number;
          daily_fat_goal_g: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          date_of_birth?: string | null;
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
          goal_type?: 'weight_loss' | 'maintenance' | 'muscle_gain';
          daily_calorie_goal?: number;
          daily_protein_goal_g?: number;
          daily_carbs_goal_g?: number;
          daily_fat_goal_g?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          date_of_birth?: string | null;
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
          goal_type?: 'weight_loss' | 'maintenance' | 'muscle_gain';
          daily_calorie_goal?: number;
          daily_protein_goal_g?: number;
          daily_carbs_goal_g?: number;
          daily_fat_goal_g?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      foods: {
        Row: {
          id: string;
          created_by: string | null;
          name: string;
          brand: string | null;
          barcode: string | null;
          serving_size_g: number;
          serving_description: string | null;
          calories_per_serving: number;
          protein_g: number;
          carbs_g: number;
          fat_g: number;
          fiber_g: number | null;
          sugar_g: number | null;
          sodium_mg: number | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_by?: string | null;
          name: string;
          brand?: string | null;
          barcode?: string | null;
          serving_size_g?: number;
          serving_description?: string | null;
          calories_per_serving: number;
          protein_g?: number;
          carbs_g?: number;
          fat_g?: number;
          fiber_g?: number | null;
          sugar_g?: number | null;
          sodium_mg?: number | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          created_by?: string | null;
          name?: string;
          brand?: string | null;
          barcode?: string | null;
          serving_size_g?: number;
          serving_description?: string | null;
          calories_per_serving?: number;
          protein_g?: number;
          carbs_g?: number;
          fat_g?: number;
          fiber_g?: number | null;
          sugar_g?: number | null;
          sodium_mg?: number | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      meals: {
        Row: {
          id: string;
          user_id: string;
          logged_date: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          name: string | null;
          photo_url: string | null;
          ai_analysis: Record<string, unknown> | null;
          notes: string | null;
          total_calories: number;
          total_protein_g: number;
          total_carbs_g: number;
          total_fat_g: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          logged_date?: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          name?: string | null;
          photo_url?: string | null;
          ai_analysis?: Record<string, unknown> | null;
          notes?: string | null;
          total_calories?: number;
          total_protein_g?: number;
          total_carbs_g?: number;
          total_fat_g?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          logged_date?: string;
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          name?: string | null;
          photo_url?: string | null;
          ai_analysis?: Record<string, unknown> | null;
          notes?: string | null;
          total_calories?: number;
          total_protein_g?: number;
          total_carbs_g?: number;
          total_fat_g?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      meal_items: {
        Row: {
          id: string;
          meal_id: string;
          food_id: string | null;
          custom_food_name: string | null;
          quantity_g: number;
          serving_multiplier: number;
          calories: number;
          protein_g: number;
          carbs_g: number;
          fat_g: number;
          fiber_g: number | null;
          sugar_g: number | null;
          sodium_mg: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          meal_id: string;
          food_id?: string | null;
          custom_food_name?: string | null;
          quantity_g: number;
          serving_multiplier?: number;
          calories: number;
          protein_g?: number;
          carbs_g?: number;
          fat_g?: number;
          fiber_g?: number | null;
          sugar_g?: number | null;
          sodium_mg?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          meal_id?: string;
          food_id?: string | null;
          custom_food_name?: string | null;
          quantity_g?: number;
          serving_multiplier?: number;
          calories?: number;
          protein_g?: number;
          carbs_g?: number;
          fat_g?: number;
          fiber_g?: number | null;
          sugar_g?: number | null;
          sodium_mg?: number | null;
          created_at?: string;
        };
      };
      progress_logs: {
        Row: {
          id: string;
          user_id: string;
          logged_date: string;
          weight_kg: number | null;
          body_fat_pct: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          logged_date?: string;
          weight_kg?: number | null;
          body_fat_pct?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          logged_date?: string;
          weight_kg?: number | null;
          body_fat_pct?: number | null;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// ============================================================
// Convenience Row type aliases
// ============================================================
export type Profile      = Database['public']['Tables']['profiles']['Row'];
export type Food         = Database['public']['Tables']['foods']['Row'];
export type Meal         = Database['public']['Tables']['meals']['Row'];
export type MealItem     = Database['public']['Tables']['meal_items']['Row'];
export type ProgressLog  = Database['public']['Tables']['progress_logs']['Row'];

// Insert type aliases
export type ProfileInsert     = Database['public']['Tables']['profiles']['Insert'];
export type FoodInsert        = Database['public']['Tables']['foods']['Insert'];
export type MealInsert        = Database['public']['Tables']['meals']['Insert'];
export type MealItemInsert    = Database['public']['Tables']['meal_items']['Insert'];
export type ProgressLogInsert = Database['public']['Tables']['progress_logs']['Insert'];

// Update type aliases
export type ProfileUpdate     = Database['public']['Tables']['profiles']['Update'];
export type FoodUpdate        = Database['public']['Tables']['foods']['Update'];
export type MealUpdate        = Database['public']['Tables']['meals']['Update'];
export type MealItemUpdate    = Database['public']['Tables']['meal_items']['Update'];
export type ProgressLogUpdate = Database['public']['Tables']['progress_logs']['Update'];
