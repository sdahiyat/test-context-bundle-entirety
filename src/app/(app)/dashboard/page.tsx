'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/auth/login');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          {user?.email && (
            <p className="text-gray-500 text-sm mt-0.5">
              Welcome back, <span className="font-medium text-gray-700">{user.email}</span>
            </p>
          )}
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Today's Summary */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Today&apos;s Summary</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Calories', value: '—', unit: 'kcal', color: 'text-orange-600' },
              { label: 'Protein', value: '—', unit: 'g', color: 'text-blue-600' },
              { label: 'Carbs', value: '—', unit: 'g', color: 'text-green-600' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.unit}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">No meals logged today</p>
          </div>
        </div>
      </section>

      {/* Recent Meals */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Meals</h2>
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">No meals logged yet</p>
            <p className="text-gray-400 text-xs mt-1">
              Your recent meals will appear here once you start logging
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
