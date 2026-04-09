'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserProfile } from '@/types/profile'
import type { ActivityLevel, GoalType } from '@/lib/nutrition'
import { calculateBMR, calculateTDEE, calculateTargetCalories, calculateMacros } from '@/lib/nutrition'

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

const GOAL_LABELS: Record<string, string> = {
  weight_loss: 'Weight Loss',
  maintenance: 'Maintenance',
  muscle_gain: 'Muscle Gain',
}

function getAge(dateOfBirth: string | null | undefined): number | null {
  if (!dateOfBirth) return null
  const dob = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age > 0 && age < 120 ? age : null
}

export default function ProfileEditForm({ profile }: Props) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    full_name: profile.full_name ?? '',
    date_of_birth: profile.date_of_birth ?? '',
    sex: profile.sex ?? ('' as '' | 'male' | 'female'),
    height_cm: profile.height_cm ? String(profile.height_cm) : '',
    weight_kg: profile.weight_kg ? String(profile.weight_kg) : '',
    activity_level: profile.activity_level ?? ('' as '' | ActivityLevel),
    goal_type: profile.goal_type ?? ('' as '' | GoalType),
    target_calories: profile.target_calories ? String(profile.target_calories) : '',
    target_protein_g: profile.target_protein_g ? String(profile.target_protein_g) : '',
    target_carbs_g: profile.target_carbs_g ? String(profile.target_carbs_g) : '',
    target_fat_g: profile.target_fat_g ? String(profile.target_fat_g) : '',
  })

  const handleRecalculate = () => {
    const age = getAge(formData.date_of_birth)
    const weight = parseFloat(formData.weight_kg)
    const height = parseFloat(formData.height_cm)
    const sex = formData.sex as 'male' | 'female'
    const activityLevel = formData.activity_level as ActivityLevel
    const goalType = formData.goal_type as GoalType

    if (weight && height && age && sex && activityLevel && goalType) {
      const bmr = calculateBMR(weight, height, age, sex)
      const tdee = calculateTDEE(bmr, activityLevel)
      const calories = calculateTargetCalories(tdee, goalType)
      const macros = calculateMacros(calories, goalType)

      setFormData((prev) => ({
        ...prev,
        target_calories: String(calories),
        target_protein_g: String(macros.protein),
        target_carbs_g: String(macros.carbs),
        target_fat_g: String(macros.fat),
      }))
    } else {
      setError('Fill in your body metrics, sex, activity level, and goal to recalculate.')
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: profile.full_name ?? '',
      date_of_birth: profile.date_of_birth ?? '',
      sex: profile.sex ?? '',
      height_cm: profile.height_cm ? String(profile.height_cm) : '',
      weight_kg: profile.weight_kg ? String(profile.weight_kg) : '',
      activity_level: profile.activity_level ?? '',
      goal_type: profile.goal_type ?? '',
      target_calories: profile.target_calories ? String(profile.target_calories) : '',
      target_protein_g: profile.target_protein_g ? String(profile.target_protein_g) : '',
      target_carbs_g: profile.target_carbs_g ? String(profile.target_carbs_g) : '',
      target_fat_g: profile.target_fat_g ? String(profile.target_fat_g) : '',
    })
    setError(null)
    setIsEditing(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSuccess(false)

    const payload = {
      full_name: formData.full_name || null,
      date_of_birth: formData.date_of_birth || null,
      sex: formData.sex || null,
      height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      activity_level: formData.activity_level || null,
      goal_type: formData.goal_type || null,
      target_calories: formData.target_calories ? parseInt(formData.target_calories) : null,
      target_protein_g: formData.target_protein_g ? parseInt(formData.target_protein_g) : null,
      target_carbs_g: formData.target_carbs_g ? parseInt(formData.target_carbs_g) : null,
      target_fat_g: formData.target_fat_g ? parseInt(formData.target_fat_g) : null,
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (!res.ok || result.error) {
        setError(result.error ?? 'Failed to save changes.')
      } else {
        setSuccess(true)
        setIsEditing(false)
        router.refresh()
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'

  const fieldClass = 'flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 border-b border-gray-100 last:border-0'
  const labelClass = 'text-sm font-medium text-gray-500 sm:w-40 flex-shrink-0'
  const valueClass = 'text-sm text-gray-900'

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Edit Profile
          </button>
        ) : null}
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          ✓ Profile saved successfully!
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {!isEditing ? (
        /* View mode */
        <div>
          <div className={fieldClass}>
            <span className={labelClass}>Full Name</span>
            <span className={valueClass}>{profile.full_name ?? '—'}</span>
          </div>
          <div className={fieldClass}>
            <span className={labelClass}>Date of Birth</span>
            <span className={valueClass}>
              {profile.date_of_birth
                ? new Date(profile.date_of_birth).toLocaleDateString()
                : '—'}
            </span>
          </div>
          <div className={fieldClass}>
            <span className={labelClass}>Sex</span>
            <span className={valueClass} style={{ textTransform: 'capitalize' }}>
              {profile.sex ?? '—'}
            </span>
          </div>
          <div className={fieldClass}>
            <span className={labelClass}>Height</span>
            <span className={valueClass}>
              {profile.height_cm ? `${profile.height_cm} cm` : '—'}
            </span>
          </div>
          <div className={fieldClass}>
            <span className={labelClass}>Weight</span>
            <span className={valueClass}>
              {profile.weight_kg ? `${profile.weight_kg} kg` : '—'}
            </span>
          </div>
          <div className={fieldClass}>
            <span className={labelClass}>Activity Level</span>
            <span className={valueClass}>
              {profile.activity_level ? ACTIVITY_LABELS[profile.activity_level] : '—'}
            </span>
          </div>
          <div className={fieldClass}>
            <span className={labelClass}>Goal</span>
            <span className={valueClass}>
              {profile.goal_type ? GOAL_LABELS[profile.goal_type] : '—'}
            </span>
          </div>
          <div className={fieldClass}>
            <span className={labelClass}>Calorie Target</span>
            <span className={valueClass}>
              {profile.target_calories ? `${profile.target_calories} kcal` : '—'}
            </span>
          </div>
        </div>
      ) : (
        /* Edit mode */
        <div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData((p) => ({ ...p, date_of_birth: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biological Sex
              </label>
              <div className="flex gap-3">
                {(['male', 'female'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, sex: p.sex === s ? '' : s }))}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                      formData.sex === s
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={formData.height_cm}
                  onChange={(e) => setFormData((p) => ({ ...p, height_cm: e.target.value }))}
                  min={50}
                  max={300}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight_kg}
                  onChange={(e) => setFormData((p) => ({ ...p, weight_kg: e.target.value }))}
                  min={20}
                  max={500}
                  step="0.1"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Level
              </label>
              <select
                value={formData.activity_level}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, activity_level: e.target.value as ActivityLevel | '' }))
                }
                className={inputClass}
              >
                <option value="">Select activity level</option>
                <option value="sedentary">Sedentary</option>
                <option value="lightly_active">Lightly Active</option>
                <option value="moderately_active">Moderately Active</option>
                <option value="very_active">Very Active</option>
                <option value="extra_active">Extra Active</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
              <select
                value={formData.goal_type}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, goal_type: e.target.value as GoalType | '' }))
                }
                className={inputClass}
              >
                <option value="">Select goal</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="maintenance">Maintenance</option>
                <option value="muscle_gain">Muscle Gain</option>
              </select>
            </div>

            {/* Recalculate button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRecalculate}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium underline"
              >
                ↻ Recalculate Targets from metrics
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Calories (kcal)
                </label>
                <input
                  type="number"
                  value={formData.target_calories}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, target_calories: e.target.value }))
                  }
                  min={800}
                  max={10000}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={formData.target_protein_g}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, target_protein_g: e.target.value }))
                  }
                  min={0}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  value={formData.target_carbs_g}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, target_carbs_g: e.target.value }))
                  }
                  min={0}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
                <input
                  type="number"
                  value={formData.target_fat_g}
                  onChange={(e) => setFormData((p) => ({ ...p, target_fat_g: e.target.value }))}
                  min={0}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Save / Cancel */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="btn-secondary px-5 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary px-5 py-2 text-sm disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
