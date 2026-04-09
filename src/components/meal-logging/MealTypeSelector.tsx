'use client'

import { MealType } from '@/types/nutrition'
import { MEAL_TYPE_LABELS } from '@/lib/nutrition'

interface MealTypeSelectorProps {
  value: MealType
  onChange: (type: MealType) => void
}

const MEAL_TYPE_ICONS: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
}

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

export default function MealTypeSelector({ value, onChange }: MealTypeSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {MEAL_TYPES.map((type) => (
        <button
          key={type}
          type="button"
          role="button"
          aria-pressed={value === type}
          onClick={() => onChange(type)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${value === type
              ? 'bg-primary-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          <span>{MEAL_TYPE_ICONS[type]}</span>
          <span>{MEAL_TYPE_LABELS[type]}</span>
        </button>
      ))}
    </div>
  )
}
