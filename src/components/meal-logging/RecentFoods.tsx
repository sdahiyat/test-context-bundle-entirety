'use client'

import { useEffect, useState } from 'react'
import { Food } from '@/types/nutrition'

interface RecentFoodsProps {
  onFoodSelect: (food: Food, quantity_g: number) => void
}

export default function RecentFoods({ onFoodSelect }: RecentFoodsProps) {
  const [recentFoods, setRecentFoods] = useState<Food[]>([])
  const [frequentFoods, setFrequentFoods] = useState<Food[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'recent' | 'frequent'>('recent')

  useEffect(() => {
    async function fetchFoods() {
      try {
        const [recentRes, frequentRes] = await Promise.all([
          fetch('/api/meals/recent-foods'),
          fetch('/api/meals/frequent-foods'),
        ])
        const [recentData, frequentData] = await Promise.all([
          recentRes.json(),
          frequentRes.json(),
        ])
        setRecentFoods(recentData.foods || [])
        setFrequentFoods(frequentData.foods || [])
      } catch {
        // Silently fail – not critical
      } finally {
        setIsLoading(false)
      }
    }

    fetchFoods()
  }, [])

  const displayFoods = activeTab === 'recent' ? recentFoods : frequentFoods

  if (isLoading || (recentFoods.length === 0 && frequentFoods.length === 0)) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('recent')}
          className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
            activeTab === 'recent'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Recent
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('frequent')}
          className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
            activeTab === 'frequent'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Frequent
        </button>
      </div>

      {displayFoods.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {displayFoods.map((food) => (
            <button
              key={food.id}
              type="button"
              onClick={() => onFoodSelect(food, 100)}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
            >
              <span>{food.name}</span>
              <span className="text-gray-400">
                · {Math.round(food.calories_per_serving)}kcal
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic">
          {activeTab === 'recent' ? 'No recent foods yet' : 'No frequent foods yet'}
        </p>
      )}
    </div>
  )
}
