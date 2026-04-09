import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Database } from '@/types/database'
import type { UserProfile } from '@/types/profile'
import ProfileEditForm from './ProfileEditForm'
import GoalsSummaryCard from './GoalsSummaryCard'

export default async function ProfilePage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile || !profile.onboarding_completed) {
    redirect('/onboarding')
  }

  const typedProfile = profile as unknown as UserProfile

  // Derive initials for avatar
  const initials = typedProfile.full_name
    ? typedProfile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back nav */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Profile header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {typedProfile.full_name ?? 'Your Profile'}
            </h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
            {typedProfile.goal_type && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                  typedProfile.goal_type === 'weight_loss'
                    ? 'bg-orange-100 text-orange-700'
                    : typedProfile.goal_type === 'muscle_gain'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {typedProfile.goal_type === 'weight_loss'
                  ? '📉 Weight Loss'
                  : typedProfile.goal_type === 'muscle_gain'
                  ? '💪 Muscle Gain'
                  : '⚖️ Maintenance'}
              </span>
            )}
          </div>
        </div>

        {/* Goals summary */}
        <div className="mb-6">
          <GoalsSummaryCard profile={typedProfile} />
        </div>

        {/* Edit form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <ProfileEditForm profile={typedProfile} />
        </div>
      </div>
    </div>
  )
}
