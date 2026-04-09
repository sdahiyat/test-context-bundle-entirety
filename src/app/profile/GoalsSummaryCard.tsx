'use client'

import Link from 'next/link'
import type { UserProfile } from '@/types/profile'

interface Props {
  profile: UserProfile
}

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'Sedentary',
  lightly_active: 'Lightly Active',
  moderately_active: 'Moderately Active',
  very_active: 'Very Active',
  extra_active: 'Extra Active',
}

function macroPercent(macroGrams: number, calsPerGram: number, totalCals: number): number {
  if (!totalCals) return 0
  return Math.round((macroGrams * calsPerGram * 100) / totalCals)
}

export default function GoalsSummaryCard({ profile }: Props) {
  const {
    goal_type,
    target_calories,
    target_protein_g,
    target_carbs_g,
    target_fat_g,
    activity_level,
  } = profile

  const goalConfig = {
    weight_loss: { label: 'Weight Loss', emoji: '📉', color: 'bg-orange-100 text-orange-700' },
    maintenance: { label: 'Maintenance', emoji: '⚖️', color: 'bg-blue-100 text-blue-700' },
    muscle_gain: { label: 'Muscle Gain', emoji: '💪', color: 'bg-green-100 text-green-700' },
  }

  const currentGoal = goal_type ? goalConfig[goal_type] : null

  const proteinPct =
    target_protein_g && target_calories
      ? macroPercent(target_protein_g, 4, target_calories)
      : null
  const carbsPct =
    target_carbs_g && target_calories
      ? macroPercent(target_carbs_g, 4, target_calories)
      : null
  const fatPct =
    target_fat_g && target_calories
      ? macroPercent(target_fat_g, 9, target_calories)
      : null

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Goals &amp; Targets</h2>
        <Link
          href="/profile?edit=true"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Edit Goals
        </Link>
      </div>

      {/* Goal badge */}
      {currentGoal && (
        <div className="mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${currentGoal.color}`}
          >
            <span>{currentGoal.emoji}</span>
            {currentGoal.label}
          </span>
        </div>
      )}

      {/* Calories */}
      <div className="text-center mb-6 p-4 bg-gray-50 rounded-xl">
        <p className="text-4xl font-bold text-primary-600">
          {target_calories ? target_calories.toLocaleString() : '—'}
        </p>
        <p className="text-gray-500 text-sm mt-1">calories per day</p>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          {
            label: 'Protein',
            value: target_protein_g,
            pct: proteinPct,
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
          },
          {
            label: 'Carbs',
            value: target_carbs_g,
            pct: carbsPct,
            color: 'bg-yellow-400',
            textColor: 'text-yellow-600',
          },
          {
            label: 'Fat',
            value: target_fat_g,
            pct: fatPct,
            color: 'bg-red-400',
            textColor: 'text-red-600',
          },
        ].map(({ label, value, pct, color, textColor }) => (
          <div key={label} className="text-center p-3 bg-gray-50 rounded-lg">
            <div className={`w-3 h-3 rounded-full ${color} mx-auto mb-1.5`} />
            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
            <p className={`font-bold text-lg ${textColor}`}>{value ? `${value}g` : '—'}</p>
            {pct !== null && (
              <p className="text-xs text-gray-400">{pct}% of cals</p>
            )}
          </div>
        ))}
      </div>

      {/* Activity level */}
      {activity_level && (
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">Activity Level:</span>
          <span className="text-sm font-medium text-gray-800">
            {ACTIVITY_LABELS[activity_level] ?? activity_level}
          </span>
        </div>
      )}
    </div>
  )
}
