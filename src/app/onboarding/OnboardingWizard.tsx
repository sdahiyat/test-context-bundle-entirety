'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { OnboardingStep, OnboardingFormData, UserProfile } from '@/types/profile'
import PersonalInfoStep from './steps/PersonalInfoStep'
import BodyMetricsStep from './steps/BodyMetricsStep'
import ActivityGoalsStep from './steps/ActivityGoalsStep'
import CalorieTargetsStep from './steps/CalorieTargetsStep'

const STEPS: OnboardingStep[] = [
  'personal_info',
  'body_metrics',
  'activity_goals',
  'calorie_targets',
]

const STEP_LABELS = ['Personal Info', 'Body Metrics', 'Activity & Goals', 'Calorie Targets']

interface Props {
  initialData?: Partial<UserProfile>
}

export default function OnboardingWizard({ initialData }: Props) {
  const router = useRouter()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<OnboardingFormData>(initialData ?? {})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentStep = STEPS[currentStepIndex]

  const handleNext = (data: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setCurrentStepIndex((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStepIndex((prev) => prev - 1)
  }

  const handleSubmit = async (finalData: Partial<OnboardingFormData>) => {
    setIsSubmitting(true)
    setError(null)

    const completeData = {
      ...formData,
      ...finalData,
      onboarding_completed: true,
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeData),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        setError(result.error ?? 'Failed to save profile. Please try again.')
        setIsSubmitting(false)
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Network error. Please check your connection and try again.')
      setIsSubmitting(false)
    }
  }

  const handleSkip = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, onboarding_completed: true }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        setError(result.error ?? 'Failed to save. Please try again.')
        setIsSubmitting(false)
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Network error. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to NutriTrack</h1>
        <p className="text-gray-500 mt-2">
          Let&apos;s set up your profile to personalise your experience
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    index < currentStepIndex
                      ? 'bg-primary-600 text-white'
                      : index === currentStepIndex
                      ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStepIndex ? '✓' : index + 1}
                </div>
                <span
                  className={`text-xs mt-1 hidden sm:block ${
                    index === currentStepIndex ? 'text-primary-600 font-medium' : 'text-gray-400'
                  }`}
                >
                  {STEP_LABELS[index]}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-colors ${
                    index < currentStepIndex ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Step content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        {currentStep === 'personal_info' && (
          <PersonalInfoStep data={formData} onNext={handleNext} />
        )}
        {currentStep === 'body_metrics' && (
          <BodyMetricsStep data={formData} onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 'activity_goals' && (
          <ActivityGoalsStep data={formData} onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 'calorie_targets' && (
          <CalorieTargetsStep
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {/* Skip option */}
      {currentStep !== 'calorie_targets' && (
        <div className="text-center mt-4">
          <button
            onClick={handleSkip}
            disabled={isSubmitting}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            Skip setup for now →
          </button>
        </div>
      )}
    </div>
  )
}
