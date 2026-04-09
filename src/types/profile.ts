import type { ActivityLevel, GoalType } from '@/lib/nutrition'

export type { ActivityLevel, GoalType }

export interface UserProfile {
  id: string
  user_id: string
  full_name: string | null
  date_of_birth: string | null
  sex: 'male' | 'female' | null
  height_cm: number | null
  weight_kg: number | null
  activity_level: ActivityLevel | null
  goal_type: GoalType | null
  target_calories: number | null
  target_protein_g: number | null
  target_carbs_g: number | null
  target_fat_g: number | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export type OnboardingStep =
  | 'personal_info'
  | 'body_metrics'
  | 'activity_goals'
  | 'calorie_targets'

export type OnboardingFormData = Partial<
  Pick<
    UserProfile,
    | 'full_name'
    | 'date_of_birth'
    | 'sex'
    | 'height_cm'
    | 'weight_kg'
    | 'activity_level'
    | 'goal_type'
    | 'target_calories'
    | 'target_protein_g'
    | 'target_carbs_g'
    | 'target_fat_g'
    | 'onboarding_completed'
  >
>
