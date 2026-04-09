'use client'

import { useState } from 'react'
import type { OnboardingFormData } from '@/types/profile'

interface Props {
  data: Partial<OnboardingFormData>
  onNext: (data: Partial<OnboardingFormData>) => void
  onBack?: () => void
}

export default function PersonalInfoStep({ data, onNext }: Props) {
  const [fullName, setFullName] = useState(data.full_name ?? '')
  const [dateOfBirth, setDateOfBirth] = useState(data.date_of_birth ?? '')
  const [sex, setSex] = useState<'male' | 'female' | ''>(data.sex ?? '')
  const [nameError, setNameError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setNameError('Please enter your name to continue.')
      return
    }
    setNameError('')
    onNext({
      full_name: fullName.trim(),
      date_of_birth: dateOfBirth || null,
      sex: sex || null,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tell us about yourself</h2>
        <p className="text-gray-500 mt-1 text-sm">
          This helps us personalise your nutrition plan.
        </p>
      </div>

      {/* Full Name */}
      <div className="mb-5">
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="full_name"
          type="text"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value)
            if (e.target.value.trim()) setNameError('')
          }}
          placeholder="Jane Smith"
          className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
            nameError ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {nameError && <p className="mt-1 text-xs text-red-600">{nameError}</p>}
      </div>

      {/* Date of Birth */}
      <div className="mb-5">
        <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth{' '}
          <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <input
          id="date_of_birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
        />
        <p className="mt-1 text-xs text-gray-400">Used to calculate your calorie needs</p>
      </div>

      {/* Sex */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Biological Sex{' '}
          <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <div className="flex gap-3">
          {(['male', 'female'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSex(sex === option ? '' : option)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium text-sm capitalize transition-all ${
                sex === option
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {option === 'male' ? '♂ Male' : '♀ Female'}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Used in metabolic calculations (Mifflin-St Jeor equation)
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <button type="submit" className="btn-primary px-8 py-2.5">
          Continue →
        </button>
      </div>
    </form>
  )
}
