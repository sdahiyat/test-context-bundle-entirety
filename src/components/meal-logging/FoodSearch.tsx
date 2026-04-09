'use client'

import { useEffect, useRef, useState } from 'react'
import { Food } from '@/types/nutrition'
import { calculateItemNutrition } from '@/lib/nutrition'
import PortionSelector from './PortionSelector'

interface FoodSearchProps {
  onFoodSelect: (food: Food, quantity_g: number) => void
}

export default function FoodSearch({ onFoodSelect }: FoodSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Food[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [quantity, setQuantity] = useState(100)
  const [showResults, setShowResults] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    setIsLoading(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/foods?q=${encodeURIComponent(query.trim())}`)
        const data = await res.json()
        setResults(data.foods || [])
        setShowResults(true)
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Click outside to close
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  function handleFoodClick(food: Food) {
    setSelectedFood(food)
    setQuantity(100)
    setShowResults(false)
    setQuery(food.name)
  }

  function handleConfirm() {
    if (selectedFood) {
      onFoodSelect(selectedFood, quantity)
      setQuery('')
      setSelectedFood(null)
      setQuantity(100)
      setResults([])
    }
  }

  function handleCancel() {
    setSelectedFood(null)
    setQuery('')
    setQuantity(100)
    setResults([])
    setShowResults(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedFood(null)
          }}
          onFocus={() => {
            if (results.length > 0) setShowResults(true)
          }}
          placeholder="Search foods (e.g. chicken, rice, apple...)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && !selectedFood && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {results.map((food) => {
            const per100 = calculateItemNutrition(food, 100)
            return (
              <button
                key={food.id}
                type="button"
                onClick={() => handleFoodClick(food)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{food.name}</p>
                    {food.brand && (
                      <p className="text-xs text-gray-500">{food.brand}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-xs font-medium text-gray-700">
                      {Math.round(per100.calories)} kcal
                    </p>
                    <p className="text-xs text-gray-400">per 100g</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {showResults && results.length === 0 && !isLoading && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500">
          No foods found for &quot;{query}&quot;
        </div>
      )}

      {/* Portion Selector */}
      {selectedFood && (
        <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <PortionSelector
            food={selectedFood}
            value={quantity}
            onChange={setQuantity}
          />
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Add to Meal
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
