import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SettingsRow from '@/components/settings/SettingsRow';
import SettingsSection from '@/components/settings/SettingsSection';

async function getSession() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const userEmail = session.user.email || '';
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{userEmail}</p>
            <p className="text-xs text-gray-500 mt-0.5">Manage your account settings</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Account Section */}
          <SettingsSection
            title="Account"
            description="Manage your email, password, and account security"
          >
            <SettingsRow
              href="/settings/account"
              label="Email & Password"
              description="Update your login credentials"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
            />
          </SettingsSection>

          {/* Preferences Section */}
          <SettingsSection title="Preferences" description="Customize your app experience">
            <SettingsRow
              href="/settings/preferences"
              label="Units & Theme"
              description="Metric/Imperial units and display theme"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
                </svg>
              }
            />
            <div className="border-t border-gray-100" />
            <SettingsRow
              href="/settings/notifications"
              label="Notifications"
              description="Control what alerts you receive"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              }
            />
          </SettingsSection>

          {/* Data & Privacy Section */}
          <SettingsSection
            title="Data & Privacy"
            description="Export your data or delete your account"
          >
            <SettingsRow
              href="/settings/data"
              label="Data & Privacy"
              description="Export your data or delete your account"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
            />
          </SettingsSection>

          {/* Sign Out */}
          <div className="pt-2">
            <Link
              href="/auth/login"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
