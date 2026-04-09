'use client'

import { useState } from 'react'
import type { OnboardingFormData } from '@/types/profile'

interface Props {
  data: Partial<OnboardingFormData>
  onNext: (data: Partial<OnboardingFormData>) => void
  onBack: () => void
}

type UnitSystem = 'metric' | 'imperial'

export default function BodyMetricsStep({ data, onNext, onBack }: Props) {
  const [unit, setUnit] = useState<UnitSystem>('metric')

  // Metric state
  const [heightCm, setHeightCm] = useState<string>(
    data.height_cm ? String(Math.round(data.height_cm)) : ''
  )
  const [weightKg, setWeightKg] = useState<string>(
    data.weight_kg ? String(Math.round(data.weight_kg * 10) / 10) : ''
  )

  // Imperial state
  const [heightFt, setHeightFt] = useState<string>(
    data.height_cm ? String(Math.floor(data.height_cm / 30.48)) : ''
  )
  const [heightIn, setHeightIn] = useState<string>(
    data.height_cm
      ? String(Math.round((data.height_cm / 2.54) % 12))
      : ''
  )
  const [weightLbs, setWeightLbs] = useState<string>(
    data.weight_kg ? String(Math.round(data.weight_kg / 0.453592)) : ''
  )

  const [errors, setErrors] = useState<{ height?: string; weight?: string }>({})

  const getMetricValues = (): { height_cm: number | null; weight_kg: number | null } => {
    if (unit === 'metric') {
      return {
        height_cm: heightCm ? parseFloat(heightCm) : null,
        weight_kg: weightKg ? parseFloat(weightKg) : null,
      }
    } else {
      const ft = parseFloat(heightFt) || 0
      const inches = parseFloat(heightIn) || 0
      const totalInches = ft * 12 + inches
      return {
        height_cm: totalInches > 0 ? Math.round(totalInches * 2.54 * 10) / 10 : null,
        weight_kg: weightLbs ? Math.round(parseFloat(weightLbs) * 0.453592 * 10) / 10 : null,
      }
    }
  }

  const validate = (): boolean => {
    const newErrors: { height?: string; weight?: string } = {}
    const { height_cm, weight_kg } = getMetricValues()

    if (height_cm !== null && (height_cm < 50 || height_cm > 300)) {
      newErrors.height = 'Please enter a valid height (50–300 cm)'
    }
    if (weight_kg !== null && (weight_kg < 20 || weight_kg > 500)) {
      newErrors.weight = 'Please enter a valid weight (20–500 kg)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const { height_cm, weight_kg } = getMetricValues()
    onNext({ height_cm, weight_kg })
  }

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition'

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your body metrics</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Used to calculate your personalised calorie needs.
        </p>
      </div>

      {/* Unit toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        {(['metric', 'imperial'] as const).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUnit(u)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
              unit === u
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {u}
          </button>
        ))}
      </div>

      {/* Height */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Height <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        {unit === 'metric' ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="170"
              min={50}
              max={300}
              className={`${inputClass} ${errors.height ? 'border-red-400 bg-red-50' : ''}`}
            />
            <span className="text-gray-500 font-medium w-8">cm</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 flex-1">
              <input
                type="number"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                placeholder="5"
                min={1}
                max={9}
                className={`${inputClass} ${errors.height ? 'border-red-400 bg-red-50' : ''}`}
              />
              <span className="text-gray-500 font-medium w-5">ft</span>
            </div>
            <div className="flex items-center gap-1 flex-1">
              <input
                type="number"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                placeholder="8"
                min={0}
                max={11}
                className={`${inputClass} ${errors.height ? 'border-red-400 bg-red-50' : ''}`}
              />
              <span className="text-gray-500 font-medium w-5">in</span>
            </div>
          </div>
        )}
        {errors.height && <p className="mt-1 text-xs text-red-600">{errors.height}</p>}
      </div>

      {/* Weight */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Weight <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={unit === 'metric' ? weightKg : weightLbs}
            onChange={(e) =>
              unit === 'metric' ? setWeightKg(e.target.value) : setWeightLbs(e.target.value)
            }
            placeholder={unit === 'metric' ? '70' : '154'}
            min={unit === 'metric' ? 20 : 44}
            max={unit === 'metric' ? 500 : 1100}
            step="0.1"
            className={`${inputClass} ${errors.weight ? 'border-red-400 bg-red-50' : ''}`}
          />
          <span className="text-gray-500 font-medium w-8">
            {unit === 'metric' ? 'kg' : 'lbs'}
          </span>
        </div>
        {errors.weight && <p className="mt-1 text-xs text-red-600">{errors.weight}</p>}
      </div>

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
