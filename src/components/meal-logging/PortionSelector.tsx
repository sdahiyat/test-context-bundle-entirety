'use client'

import { Food } from '@/types/nutrition'
import { calculateItemNutrition } from '@/lib/nutrition'

interface PortionSelectorProps {
  food: Food
  value: number
  onChange: (grams: number) => void
}

const QUICK_PRESETS = [50, 100, 150, 200, 250, 300]

export default function PortionSelector({ food, value, onChange }: PortionSelectorProps) {
  const nutrition = calculateItemNutrition(food, value)
  const servings = (value / food.serving_size_g).toFixed(1)

  return (
    <div className="space-y-3">
      <p className="font-medium text-gray-900 text-sm">{food.name}</p>

      <div className="flex items-center gap-2">
        <label htmlFor="portion-input" className="text-sm text-gray-600 shrink-0">
          Grams:
        </label>
        <input
          id="portion-input"
          type="number"
          min={1}
          max={5000}
          step={1}
          value={value}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10)
            if (!isNaN(val) && val > 0) onChange(val)
          }}
          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <span className="text-xs text-gray-500">= {servings} serving(s)</span>
      </div>

      <div className="flex gap-1 flex-wrap">
        {QUICK_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`px-2 py-1 text-xs rounded border transition-colors ${
              value === preset
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {preset}g
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 bg-gray-50 rounded-lg p-3">
        <div className="text-center">
          <p className="text-xs text-gray-500">Calories</p>
          <p className="text-sm font-semibold text-gray-900">{Math.round(nutrition.calories)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Protein</p>
          <p className="text-sm font-semibold text-gray-900">{nutrition.protein_g.toFixed(1)}g</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Carbs</p>
          <p className="text-sm font-semibold text-gray-900">{nutrition.carbs_g.toFixed(1)}g</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Fat</p>
          <p className="text-sm font-semibold text-gray-900">{nutrition.fat_g.toFixed(1)}g</p>
        </div>
      </div>
    </div>
  )
}
