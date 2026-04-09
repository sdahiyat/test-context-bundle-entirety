import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-primary-600 font-bold text-lg">🥗 NutriTrack</span>
          </Link>
          <span className="text-sm text-gray-500 truncate max-w-[160px]">
            {session.user.email}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="max-w-2xl mx-auto flex justify-around py-2">
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-0.5 px-4 py-1 text-gray-500 hover:text-primary-600 transition-colors"
          >
            <span className="text-xl">🏠</span>
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link
            href="/log"
            className="flex flex-col items-center gap-0.5 px-4 py-1 text-gray-500 hover:text-primary-600 transition-colors"
          >
            <span className="text-xl">➕</span>
            <span className="text-xs">Log Meal</span>
          </Link>
          <Link
            href="/progress"
            className="flex flex-col items-center gap-0.5 px-4 py-1 text-gray-500 hover:text-primary-600 transition-colors"
          >
            <span className="text-xl">📈</span>
            <span className="text-xs">Progress</span>
          </Link>
          <Link
            href="/profile"
            className="flex flex-col items-center gap-0.5 px-4 py-1 text-gray-500 hover:text-primary-600 transition-colors"
          >
            <span className="text-xl">👤</span>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
