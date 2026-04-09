export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active'

export type GoalType = 'weight_loss' | 'maintenance' | 'muscle_gain'

export interface MacroTargets {
  protein: number
  carbs: number
  fat: number
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
}

/**
 * Mifflin-St Jeor equation
 * weight in kg, height in cm, age in years
 */
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  sex: 'male' | 'female'
): number {
  const base = 10 * weight + 6.25 * height - 5 * age
  return sex === 'male' ? base + 5 : base - 161
}

/**
 * Total Daily Energy Expenditure
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel])
}

/**
 * Target calories adjusted for goal type
 */
export function calculateTargetCalories(tdee: number, goalType: GoalType): number {
  switch (goalType) {
    case 'weight_loss':
      return Math.round(tdee - 500)
    case 'muscle_gain':
      return Math.round(tdee + 300)
    case 'maintenance':
    default:
      return Math.round(tdee)
  }
}

/**
 * Macro targets in grams based on calorie target and goal type
 * weight_loss:   40% protein, 30% carbs, 30% fat
 * muscle_gain:   35% protein, 40% carbs, 25% fat
 * maintenance:   30% protein, 40% carbs, 30% fat
 *
 * Protein & carbs = 4 cal/g, fat = 9 cal/g
 */
export function calculateMacros(targetCalories: number, goalType: string): MacroTargets {
  let proteinPct: number
  let carbsPct: number
  let fatPct: number

  switch (goalType) {
    case 'weight_loss':
      proteinPct = 0.4
      carbsPct = 0.3
      fatPct = 0.3
      break
    case 'muscle_gain':
      proteinPct = 0.35
      carbsPct = 0.4
      fatPct = 0.25
      break
    case 'maintenance':
    default:
      proteinPct = 0.3
      carbsPct = 0.4
      fatPct = 0.3
      break
  }

  return {
    protein: Math.round((targetCalories * proteinPct) / 4),
    carbs: Math.round((targetCalories * carbsPct) / 4),
    fat: Math.round((targetCalories * fatPct) / 9),
  }
}
