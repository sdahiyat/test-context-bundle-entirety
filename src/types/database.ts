export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          height_cm: number | null;
          weight_kg: number | null;
          target_calories: number | null;
          goal: 'lose_weight' | 'maintain' | 'gain_weight' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          target_calories?: number | null;
          goal?: 'lose_weight' | 'maintain' | 'gain_weight' | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          target_calories?: number | null;
          goal?: 'lose_weight' | 'maintain' | 'gain_weight' | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      meals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          logged_at: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          notes: string | null;
          photo_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          logged_at?: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          notes?: string | null;
          photo_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          logged_at?: string;
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          notes?: string | null;
          photo_url?: string | null;
          created_at?: string;
        };
      };
      meal_items: {
        Row: {
          id: string;
          meal_id: string;
          food_id: string | null;
          name: string;
          quantity: number;
          unit: string;
          calories: number;
          protein_g: number;
          carbs_g: number;
          fat_g: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          meal_id: string;
          food_id?: string | null;
          name: string;
          quantity: number;
          unit: string;
          calories: number;
          protein_g: number;
          carbs_g: number;
          fat_g: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          meal_id?: string;
          food_id?: string | null;
          name?: string;
          quantity?: number;
          unit?: string;
          calories?: number;
          protein_g?: number;
          carbs_g?: number;
          fat_g?: number;
          created_at?: string;
        };
      };
      foods: {
        Row: {
          id: string;
          name: string;
          brand: string | null;
          calories_per_100g: number;
          protein_per_100g: number;
          carbs_per_100g: number;
          fat_per_100g: number;
          serving_size_g: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          brand?: string | null;
          calories_per_100g: number;
          protein_per_100g: number;
          carbs_per_100g: number;
          fat_per_100g: number;
          serving_size_g?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          brand?: string | null;
          calories_per_100g?: number;
          protein_per_100g?: number;
          carbs_per_100g?: number;
          fat_per_100g?: number;
          serving_size_g?: number | null;
          created_at?: string;
        };
      };
    };
  };
};
