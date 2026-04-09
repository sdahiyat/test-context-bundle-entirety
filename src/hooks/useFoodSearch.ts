'use client'

import { useState, useEffect } from 'react'
import { Food } from '@/types/nutrition'

export default function useFoodSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Food[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/foods?q=${encodeURIComponent(query.trim())}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to search foods')
        }

        setResults(data.foods || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return { query, setQuery, results, isLoading, error }
}
