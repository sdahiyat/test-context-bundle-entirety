'use client'

import { Food, UserGoals } from '@/types/nutrition'
import { calculateMealTotals } from '@/lib/nutrition'

interface NutritionPreviewProps {
  items: Array<{ food: Food; quantity_g: number }>
  userGoals?: UserGoals
}

interface MacroCardProps {
  label: string
  value: number
  unit: string
  target?: number
}

function MacroCard({ label, value, unit, target }: MacroCardProps) {
  const percentage = target ? Math.min((value / target) * 100, 110) : null
  const displayPct = target ? (value / target) * 100 : null

  let barColor = 'bg-primary-500'
  if (displayPct !== null) {
    if (displayPct > 110) barColor = 'bg-red-500'
    else if (displayPct >= 90) barColor = 'bg-yellow-500'
    else barColor = 'bg-green-500'
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-1">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-lg font-bold text-gray-900">
        {unit === 'kcal' ? Math.round(value) : value.toFixed(1)}
        <span className="text-xs font-normal text-gray-500 ml-1">{unit}</span>
      </p>
      {target && (
        <>
          <p className="text-xs text-gray-400">/ {target} {unit} goal</p>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className={`${barColor} h-1.5 rounded-full transition-all`}
              style={{ width: `${Math.min(percentage || 0, 100)}%` }}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default function NutritionPreview({ items, userGoals }: NutritionPreviewProps) {
  const totals = calculateMealTotals(items)

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <MacroCard
        label="Calories"
        value={totals.calories}
        unit="kcal"
        target={userGoals?.target_calories}
      />
      <MacroCard
        label="Protein"
        value={totals.protein_g}
        unit="g"
        target={userGoals?.target_protein_g}
      />
      <MacroCard
        label="Carbs"
        value={totals.carbs_g}
        unit="g"
        target={userGoals?.target_carbs_g}
      />
      <MacroCard
        label="Fat"
        value={totals.fat_g}
        unit="g"
        target={userGoals?.target_fat_g}
      />
    </div>
  )
}
