export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          goal: 'weight_loss' | 'maintenance' | 'muscle_gain' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          goal?: 'weight_loss' | 'maintenance' | 'muscle_gain' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          goal?: 'weight_loss' | 'maintenance' | 'muscle_gain' | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          date_of_birth: string | null
          sex: 'male' | 'female' | null
          height_cm: number | null
          weight_kg: number | null
          activity_level:
            | 'sedentary'
            | 'lightly_active'
            | 'moderately_active'
            | 'very_active'
            | 'extra_active'
            | null
          goal_type: 'weight_loss' | 'maintenance' | 'muscle_gain' | null
          target_calories: number | null
          target_protein_g: number | null
          target_carbs_g: number | null
          target_fat_g: number | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          date_of_birth?: string | null
          sex?: 'male' | 'female' | null
          height_cm?: number | null
          weight_kg?: number | null
          activity_level?:
            | 'sedentary'
            | 'lightly_active'
            | 'moderately_active'
            | 'very_active'
            | 'extra_active'
            | null
          goal_type?: 'weight_loss' | 'maintenance' | 'muscle_gain' | null
          target_calories?: number | null
          target_protein_g?: number | null
          target_carbs_g?: number | null
          target_fat_g?: number | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          date_of_birth?: string | null
          sex?: 'male' | 'female' | null
          height_cm?: number | null
          weight_kg?: number | null
          activity_level?:
            | 'sedentary'
            | 'lightly_active'
            | 'moderately_active'
            | 'very_active'
            | 'extra_active'
            | null
          goal_type?: 'weight_loss' | 'maintenance' | 'muscle_gain' | null
          target_calories?: number | null
          target_protein_g?: number | null
          target_carbs_g?: number | null
          target_fat_g?: number | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
