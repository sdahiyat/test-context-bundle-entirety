'use client'

import { useEffect, useState } from 'react'
import type { OnboardingFormData } from '@/types/profile'
import {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateMacros,
} from '@/lib/nutrition'

interface Props {
  data: Partial<OnboardingFormData>
  onNext: (data: Partial<OnboardingFormData>) => void
  onBack: () => void
  onSubmit: (data: Partial<OnboardingFormData>) => void
  isSubmitting?: boolean
}

const DEFAULT_CALORIES = 2000

function getAge(dateOfBirth: string | null | undefined): number | null {
  if (!dateOfBirth) return null
  const dob = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age > 0 && age < 120 ? age : null
}

export default function CalorieTargetsStep({
  data,
  onBack,
  onSubmit,
  isSubmitting,
}: Props) {
  const [targetCalories, setTargetCalories] = useState(DEFAULT_CALORIES)
  const [targetProtein, setTargetProtein] = useState(150)
  const [targetCarbs, setTargetCarbs] = useState(200)
  const [targetFat, setTargetFat] = useState(67)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [suggested, setSuggested] = useState<null | {
    calories: number
    protein: number
    carbs: number
    fat: number
  }>(null)

  useEffect(() => {
    const age = getAge(data.date_of_birth)
    const { weight_kg, height_cm, sex, activity_level, goal_type } = data

    if (weight_kg && height_cm && age && sex && activity_level && goal_type) {
      const bmr = calculateBMR(weight_kg, height_cm, age, sex)
      const tdee = calculateTDEE(bmr, activity_level)
      const calories = calculateTargetCalories(tdee, goal_type)
      const macros = calculateMacros(calories, goal_type)

      const result = {
        calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
      }
      setSuggested(result)
      setTargetCalories(calories)
      setTargetProtein(macros.protein)
      setTargetCarbs(macros.carbs)
      setTargetFat(macros.fat)
    } else {
      // Fallback defaults
      const goalType = goal_type ?? 'maintenance'
      const macros = calculateMacros(DEFAULT_CALORIES, goalType)
      setTargetCalories(DEFAULT_CALORIES)
      setTargetProtein(macros.protein)
      setTargetCarbs(macros.carbs)
      setTargetFat(macros.fat)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const totalCalFromMacros = targetProtein * 4 + targetCarbs * 4 + targetFat * 9
  const proteinPct = totalCalFromMacros > 0 ? (targetProtein * 4 / totalCalFromMacros) * 100 : 33
  const carbsPct = totalCalFromMacros > 0 ? (targetCarbs * 4 / totalCalFromMacros) * 100 : 33
  const fatPct = totalCalFromMacros > 0 ? (targetFat * 9 / totalCalFromMacros) * 100 : 34

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      target_calories: targetCalories,
      target_protein_g: targetProtein,
      target_carbs_g: targetCarbs,
      target_fat_g: targetFat,
    })
  }

  const handleReset = () => {
    if (suggested) {
      setTargetCalories(suggested.calories)
      setTargetProtein(suggested.protein)
      setTargetCarbs(suggested.carbs)
      setTargetFat(suggested.fat)
    }
    setIsCustomizing(false)
  }

  const goalLabel =
    data.goal_type === 'weight_loss'
      ? 'Weight Loss'
      : data.goal_type === 'muscle_gain'
      ? 'Muscle Gain'
      : 'Maintenance'

  const hasFullData = !!(data.weight_kg && data.height_cm && data.date_of_birth && data.sex)

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Calorie Targets</h2>
        <p className="text-gray-500 mt-1 text-sm">
          {hasFullData
            ? 'We calculated these based on your profile and goal.'
            : 'Here are balanced default targets. Add more info to get personalised numbers.'}
        </p>
      </div>

      {/* Goal badge */}
      {data.goal_type && (
        <div className="mb-5">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              data.goal_type === 'weight_loss'
                ? 'bg-orange-100 text-orange-700'
                : data.goal_type === 'muscle_gain'
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            Goal: {goalLabel}
          </span>
        </div>
      )}

      {/* Calorie display */}
      <div className="text-center mb-6 p-4 bg-gray-50 rounded-xl">
        {isCustomizing ? (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Daily Calorie Target
            </label>
            <input
              type="number"
              value={targetCalories}
              onChange={(e) => setTargetCalories(Number(e.target.value))}
              min={800}
              max={10000}
              className="w-40 text-center text-3xl font-bold text-primary-600 border-b-2 border-primary-400 bg-transparent focus:outline-none"
            />
            <span className="text-gray-500 ml-2 text-lg">kcal</span>
          </div>
        ) : (
          <div>
            <p className="text-5xl font-bold text-primary-600">{targetCalories.toLocaleString()}</p>
            <p className="text-gray-500 mt-1">calories per day</p>
          </div>
        )}
      </div>

      {/* Macro breakdown bar */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Macro Breakdown</p>
        <div className="flex rounded-full overflow-hidden h-4 mb-3">
          <div
            className="bg-blue-500 transition-all"
            style={{ width: `${proteinPct}%` }}
            title="Protein"
          />
          <div
            className="bg-yellow-400 transition-all"
            style={{ width: `${carbsPct}%` }}
            title="Carbs"
          />
          <div
            className="bg-red-400 transition-all"
            style={{ width: `${fatPct}%` }}
            title="Fat"
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Protein', value: targetProtein, color: 'bg-blue-500', pct: proteinPct, setter: setTargetProtein, unit: 'g' },
            { label: 'Carbs', value: targetCarbs, color: 'bg-yellow-400', pct: carbsPct, setter: setTargetCarbs, unit: 'g' },
            { label: 'Fat', value: targetFat, color: 'bg-red-400', pct: fatPct, setter: setTargetFat, unit: 'g' },
          ].map(({ label, value, color, pct, setter, unit }) => (
            <div key={label} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${color} mx-auto mb-1`} />
              <p className="text-xs text-gray-500">{label}</p>
              {isCustomizing ? (
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setter(Number(e.target.value))}
                  min={0}
                  max={9999}
                  className="w-full text-center font-bold text-gray-900 text-lg border-b border-gray-300 bg-transparent focus:outline-none"
                />
              ) : (
                <p className="font-bold text-gray-900 text-lg">{value}{unit}</p>
              )}
              <p className="text-xs text-gray-400">{Math.round(pct)}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Customize toggle */}
      <div className="flex justify-center mb-8">
        {isCustomizing ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Reset to suggested
            </button>
            <button
              type="button"
              onClick={() => setIsCustomizing(false)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Done customising
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsCustomizing(true)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium underline"
          >
            Customise targets
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn-secondary px-6 py-2.5">
          ← Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary px-8 py-2.5 disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : '🎉 Start Tracking'}
        </button>
      </div>
    </form>
  )
}
