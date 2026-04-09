'use client'

import { Food } from '@/types/nutrition'
import { calculateItemNutrition } from '@/lib/nutrition'

interface MealItemsListItem {
  food: Food
  quantity_g: number
  id?: string
}

interface MealItemsListProps {
  items: MealItemsListItem[]
  onRemove: (index: number) => void
  onQuantityChange: (index: number, quantity_g: number) => void
  isEditing?: boolean
}

export default function MealItemsList({
  items,
  onRemove,
  onQuantityChange,
  isEditing = false,
}: MealItemsListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        Add foods above to start building your meal
      </div>
    )
  }

  const grandTotal = items.reduce(
    (acc, item) => {
      const n = calculateItemNutrition(item.food, item.quantity_g)
      return {
        calories: acc.calories + n.calories,
        protein_g: acc.protein_g + n.protein_g,
        carbs_g: acc.carbs_g + n.carbs_g,
        fat_g: acc.fat_g + n.fat_g,
      }
    },
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  )

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const nutrition = calculateItemNutrition(item.food, item.quantity_g)
        return (
          <div
            key={item.id || `${item.food.id}-${index}`}
            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.food.name}</p>
              {item.food.brand && (
                <p className="text-xs text-gray-400 truncate">{item.food.brand}</p>
              )}
              <p className="text-xs text-gray-500 mt-0.5">
                {Math.round(nutrition.calories)} kcal · {nutrition.protein_g.toFixed(1)}g P ·{' '}
                {nutrition.carbs_g.toFixed(1)}g C · {nutrition.fat_g.toFixed(1)}g F
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number"
                min={1}
                max={5000}
                step={1}
                value={item.quantity_g}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10)
                  if (!isNaN(val) && val > 0) onQuantityChange(index, val)
                }}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <span className="text-xs text-gray-400">g</span>
            </div>

            <button
              type="button"
              onClick={() => onRemove(index)}
              aria-label={`Remove ${item.food.name}`}
              className="shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              ×
            </button>
          </div>
        )
      })}

      {/* Totals row */}
      <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Meal Total
        </span>
        <div className="flex gap-3 text-xs font-medium text-gray-700">
          <span>{Math.round(grandTotal.calories)} kcal</span>
          <span>{grandTotal.protein_g.toFixed(1)}g P</span>
          <span>{grandTotal.carbs_g.toFixed(1)}g C</span>
          <span>{grandTotal.fat_g.toFixed(1)}g F</span>
        </div>
      </div>
    </div>
  )
}
