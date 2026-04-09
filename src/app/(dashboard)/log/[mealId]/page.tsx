'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Food, Meal, MealType } from '@/types/nutrition'
import {
  MealTypeSelector,
  FoodSearch,
  RecentFoods,
  MealItemsList,
  NutritionPreview,
} from '@/components/meal-logging'
import { MEAL_TYPE_LABELS } from '@/lib/nutrition'

interface MealItemEntry {
  food: Food
  quantity_g: number
  id?: string
  itemId?: string
}

export default function EditMealPage({ params }: { params: { mealId: string } }) {
  const router = useRouter()
  const { mealId } = params

  const [meal, setMeal] = useState<Meal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [mealType, setMealType] = useState<MealType>('breakfast')
  const [notes, setNotes] = useState('')
  const [mealItems, setMealItems] = useState<MealItemEntry[]>([])

  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    async function fetchMeal() {
      try {
        const res = await fetch(`/api/meals/${mealId}`)
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to load meal')
        }
        const data = await res.json()
        const m: Meal = data.meal
        setMeal(m)
        setMealType(m.meal_type)
        setNotes(m.notes || '')
        setMealItems(
          (m.meal_items || []).map((item) => ({
            food: item.food!,
            quantity_g: item.quantity_g,
            id: item.id,
            itemId: item.id,
          }))
        )
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Failed to load meal')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMeal()
  }, [mealId])

  async function handleFoodSelect(food: Food, quantity_g: number) {
    try {
      const res = await fetch(`/api/meals/${mealId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ food_id: food.id, quantity_g }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add food')

      const updatedMeal: Meal = data.meal
      setMealItems(
        (updatedMeal.meal_items || []).map((item) => ({
          food: item.food!,
          quantity_g: item.quantity_g,
          id: item.id,
          itemId: item.id,
        }))
      )
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to add food')
    }
  }

  async function handleRemove(index: number) {
    const item = mealItems[index]
    if (!item.itemId) {
      setMealItems((prev) => prev.filter((_, i) => i !== index))
      return
    }

    try {
      const res = await fetch(`/api/meals/${mealId}/items/${item.itemId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to remove item')

      const updatedMeal: Meal = data.meal
      setMealItems(
        (updatedMeal.meal_items || []).map((i) => ({
          food: i.food!,
          quantity_g: i.quantity_g,
          id: i.id,
          itemId: i.id,
        }))
      )
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to remove item')
    }
  }

  async function handleQuantityChange(index: number, quantity_g: number) {
    const item = mealItems[index]

    // Optimistic update
    setMealItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, quantity_g } : it))
    )

    if (!item.itemId) return

    try {
      const res = await fetch(`/api/meals/${mealId}/items/${item.itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity_g }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update quantity')

      const updatedMeal: Meal = data.meal
      setMealItems(
        (updatedMeal.meal_items || []).map((i) => ({
          food: i.food!,
          quantity_g: i.quantity_g,
          id: i.id,
          itemId: i.id,
        }))
      )
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update quantity')
    }
  }

  async function handleSaveMeta(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setSaveError(null)

    try {
      const res = await fetch(`/api/meals/${mealId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meal_type: mealType, notes: notes.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save meal')
      router.push('/dashboard')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/meals/${mealId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete meal')
      }
      router.push('/dashboard')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to delete meal')
      setShowDeleteConfirm(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-red-600 font-medium">{loadError}</p>
        <button
          onClick={() => router.back()}
          className="text-sm text-primary-600 underline"
        >
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Meal</h1>
          <p className="text-sm text-gray-500 mt-1">
            {meal ? MEAL_TYPE_LABELS[meal.meal_type] : ''} ·{' '}
            {meal ? new Date(meal.logged_at).toLocaleDateString() : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
        >
          Delete
        </button>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
          <p className="text-sm font-medium text-red-700">
            Are you sure you want to delete this meal? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Yes, delete
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSaveMeta} className="space-y-6">
        {/* Meal Type */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Meal Type
          </h2>
          <MealTypeSelector value={mealType} onChange={setMealType} />
        </section>

        {/* Food Search */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Add More Foods
          </h2>
          <FoodSearch onFoodSelect={handleFoodSelect} />
        </section>

        {/* Quick Add */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Quick Add
          </h2>
          <RecentFoods onFoodSelect={handleFoodSelect} />
        </section>

        {/* Meal Items */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Meal Contents
          </h2>
          <MealItemsList
            items={mealItems}
            onRemove={handleRemove}
            onQuantityChange={handleQuantityChange}
            isEditing={true}
          />
        </section>

        {/* Nutrition Preview */}
        {mealItems.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Nutrition
            </h2>
            <NutritionPreview items={mealItems} />
          </section>
        )}

        {/* Notes */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Notes
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes about this meal..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </section>

        {saveError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {saveError}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium text-sm hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
