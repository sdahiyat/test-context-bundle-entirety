'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Food, MealType } from '@/types/nutrition'
import {
  MealTypeSelector,
  FoodSearch,
  RecentFoods,
  MealItemsList,
  NutritionPreview,
} from '@/components/meal-logging'

interface MealItemEntry {
  food: Food
  quantity_g: number
}

function getLocalDateTimeString() {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
}

export default function LogMealPage() {
  const router = useRouter()
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast')
  const [loggedAt, setLoggedAt] = useState(getLocalDateTimeString())
  const [notes, setNotes] = useState('')
  const [mealItems, setMealItems] = useState<MealItemEntry[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  function handleFoodSelect(food: Food, quantity_g: number) {
    setMealItems((prev) => [...prev, { food, quantity_g }])
  }

  function handleRemove(index: number) {
    setMealItems((prev) => prev.filter((_, i) => i !== index))
  }

  function handleQuantityChange(index: number, quantity_g: number) {
    setMealItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity_g } : item))
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (mealItems.length === 0) {
      setSubmitError('Please add at least one food to your meal.')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meal_type: selectedMealType,
          logged_at: new Date(loggedAt).toISOString(),
          notes: notes.trim() || undefined,
          items: mealItems.map((item) => ({
            food_id: item.food.id,
            quantity_g: item.quantity_g,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to log meal')
      }

      setSubmitSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1200)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-5xl">✅</div>
        <h2 className="text-xl font-semibold text-gray-900">Meal Logged!</h2>
        <p className="text-gray-500 text-sm">Redirecting to dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Log a Meal</h1>
        <p className="text-sm text-gray-500 mt-1">Add foods to track your nutrition</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Meal Type */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Meal Type
          </h2>
          <MealTypeSelector value={selectedMealType} onChange={setSelectedMealType} />
        </section>

        {/* Date & Time */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Date & Time
          </h2>
          <input
            type="datetime-local"
            value={loggedAt}
            onChange={(e) => setLoggedAt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </section>

        {/* Food Search */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Add Foods
          </h2>
          <FoodSearch onFoodSelect={handleFoodSelect} />
        </section>

        {/* Recent / Frequent Foods */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Quick Add
          </h2>
          <RecentFoods onFoodSelect={handleFoodSelect} />
        </section>

        {/* Meal Items */}
        {mealItems.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Meal Contents
            </h2>
            <MealItemsList
              items={mealItems}
              onRemove={handleRemove}
              onQuantityChange={handleQuantityChange}
            />
          </section>
        )}

        {/* Nutrition Preview */}
        {mealItems.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Nutrition Preview
            </h2>
            <NutritionPreview items={mealItems} />
          </section>
        )}

        {/* Notes */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Notes (optional)
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes about this meal..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </section>

        {submitError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || mealItems.length === 0}
          className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium text-sm hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Logging meal...' : 'Log Meal'}
        </button>
      </form>
    </div>
  )
}
