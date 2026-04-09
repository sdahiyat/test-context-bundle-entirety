'use client'

import { useState, useEffect, useCallback } from 'react'
import { Meal } from '@/types/nutrition'

export default function useMeals(date?: string) {
  const [meals, setMeals] = useState<Meal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMeals = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (date) params.set('date', date)

      const res = await fetch(`/api/meals?${params.toString()}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch meals')
      }

      setMeals(data.meals || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch meals')
    } finally {
      setIsLoading(false)
    }
  }, [date])

  useEffect(() => {
    fetchMeals()
  }, [fetchMeals])

  async function deleteMeal(id: string) {
    try {
      const res = await fetch(`/api/meals/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete meal')
      }
      setMeals((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      throw err
    }
  }

  return {
    meals,
    isLoading,
    error,
    refetch: fetchMeals,
    deleteMeal,
  }
}
