'use client';

import { useState } from 'react';
import SettingsNav from '@/components/settings/SettingsNav';
import SettingsSection from '@/components/settings/SettingsSection';
import PreferenceToggle from '@/components/settings/PreferenceToggle';
import { useSettings } from '@/hooks/useSettings';

export default function NotificationsPage() {
  const { settings, loading, updateSettings } = useSettings();
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleToggle = async (
    key: keyof Pick<
      NonNullable<typeof settings>,
      | 'notifications_daily_reminder'
      | 'notifications_weekly_summary'
      | 'notifications_achievements'
      | 'notifications_tips'
    >,
    value: boolean
  ) => {
    setSavingKey(key);
    setErrors((prev) => ({ ...prev, [key]: '' }));
    try {
      await updateSettings({ [key]: value });
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [key]: err instanceof Error ? err.message : 'Failed to save',
      }));
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <SettingsNav title="Notifications" />

        {/* Browser permission note */}
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
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
            className="text-blue-500 flex-shrink-0 mt-0.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs text-blue-700">
            Push notifications require browser permission. Make sure to allow notifications in your
            browser settings for this site.
          </p>
        </div>

        <div className="space-y-6">
          <SettingsSection
            title="Notification Preferences"
            description="Control which notifications you receive from NutriTrack"
          >
            <div className="divide-y divide-gray-100">
              <PreferenceToggle
                label="Daily Meal Reminder"
                description="Get reminded to log your meals each day"
                checked={settings?.notifications_daily_reminder ?? true}
                onChange={(val) => handleToggle('notifications_daily_reminder', val)}
                disabled={savingKey === 'notifications_daily_reminder'}
              />
              {errors.notifications_daily_reminder && (
                <p className="text-xs text-red-600 pb-2">{errors.notifications_daily_reminder}</p>
              )}

              <PreferenceToggle
                label="Weekly Progress Summary"
                description="Receive a weekly overview of your nutrition and goals"
                checked={settings?.notifications_weekly_summary ?? true}
                onChange={(val) => handleToggle('notifications_weekly_summary', val)}
                disabled={savingKey === 'notifications_weekly_summary'}
              />
              {errors.notifications_weekly_summary && (
                <p className="text-xs text-red-600 pb-2">{errors.notifications_weekly_summary}</p>
              )}

              <PreferenceToggle
                label="Achievement Notifications"
                description="Be notified when you reach goals and milestones"
                checked={settings?.notifications_achievements ?? true}
                onChange={(val) => handleToggle('notifications_achievements', val)}
                disabled={savingKey === 'notifications_achievements'}
              />
              {errors.notifications_achievements && (
                <p className="text-xs text-red-600 pb-2">{errors.notifications_achievements}</p>
              )}

              <PreferenceToggle
                label="Nutrition Tips"
                description="Receive helpful tips to improve your eating habits"
                checked={settings?.notifications_tips ?? true}
                onChange={(val) => handleToggle('notifications_tips', val)}
                disabled={savingKey === 'notifications_tips'}
              />
              {errors.notifications_tips && (
                <p className="text-xs text-red-600 pb-2">{errors.notifications_tips}</p>
              )}
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
