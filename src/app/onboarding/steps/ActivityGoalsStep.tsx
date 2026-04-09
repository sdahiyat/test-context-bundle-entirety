'use client'

import { useState } from 'react'
import type { OnboardingFormData, ActivityLevel, GoalType } from '@/types/profile'

interface Props {
  data: Partial<OnboardingFormData>
  onNext: (data: Partial<OnboardingFormData>) => void
  onBack: () => void
}

const ACTIVITY_OPTIONS: {
  value: ActivityLevel
  emoji: string
  title: string
  description: string
}[] = [
  {
    value: 'sedentary',
    emoji: '🪑',
    title: 'Sedentary',
    description: 'Desk job, little or no exercise',
  },
  {
    value: 'lightly_active',
    emoji: '🚶',
    title: 'Lightly Active',
    description: 'Light exercise 1–3 days/week',
  },
  {
    value: 'moderately_active',
    emoji: '🏃',
    title: 'Moderately Active',
    description: 'Moderate exercise 3–5 days/week',
  },
  {
    value: 'very_active',
    emoji: '🏋️',
    title: 'Very Active',
    description: 'Hard exercise 6–7 days/week',
  },
  {
    value: 'extra_active',
    emoji: '⚡',
    title: 'Extra Active',
    description: 'Very hard exercise or physical job',
  },
]

const GOAL_OPTIONS: {
  value: GoalType
  emoji: string
  title: string
  description: string
}[] = [
  {
    value: 'weight_loss',
    emoji: '📉',
    title: 'Weight Loss',
    description: 'Caloric deficit to lose weight',
  },
  {
    value: 'maintenance',
    emoji: '⚖️',
    title: 'Maintenance',
    description: 'Stay at current weight',
  },
  {
    value: 'muscle_gain',
    emoji: '💪',
    title: 'Muscle Gain',
    description: 'Caloric surplus to build muscle',
  },
]

export default function ActivityGoalsStep({ data, onNext, onBack }: Props) {
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(
    data.activity_level ?? null
  )
  const [goalType, setGoalType] = useState<GoalType | null>(data.goal_type ?? null)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activityLevel || !goalType) {
      setError('Please select both your activity level and goal to continue.')
      return
    }
    setError('')
    onNext({ activity_level: activityLevel, goal_type: goalType })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Activity & Goals</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Tell us how active you are and what you want to achieve.
        </p>
      </div>

      {/* Activity Level */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Activity Level <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {ACTIVITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setActivityLevel(opt.value)
                setError('')
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                activityLevel === opt.value
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <div>
                <p
                  className={`font-medium text-sm ${
                    activityLevel === opt.value ? 'text-primary-700' : 'text-gray-800'
                  }`}
                >
                  {opt.title}
                </p>
                <p className="text-xs text-gray-500">{opt.description}</p>
              </div>
              {activityLevel === opt.value && (
                <span className="ml-auto text-primary-600 font-bold text-lg">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Goal Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Primary Goal <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {GOAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setGoalType(opt.value)
                setError('')
              }}
              className={`flex flex-col items-center gap-1 p-4 rounded-lg border-2 text-center transition-all ${
                goalType === opt.value
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <span className="text-3xl">{opt.emoji}</span>
              <p
                className={`font-medium text-xs leading-tight ${
                  goalType === opt.value ? 'text-primary-700' : 'text-gray-800'
                }`}
              >
                {opt.title}
              </p>
              <p className="text-xs text-gray-400 leading-tight hidden sm:block">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn-secondary px-6 py-2.5">
          ← Back
        </button>
        <button type="submit" className="btn-primary px-8 py-2.5">
          Continue →
        </button>
      </div>
    </form>
  )
}
