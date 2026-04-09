'use client';

import { useState, useEffect } from 'react';
import SettingsNav from '@/components/settings/SettingsNav';
import SettingsSection from '@/components/settings/SettingsSection';
import { useSettings } from '@/hooks/useSettings';
import { UnitSystem, Theme } from '@/types/settings';

export default function PreferencesPage() {
  const { settings, loading, updateSettings } = useSettings();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Apply theme class to html element when settings load/change
  useEffect(() => {
    if (!settings) return;
    const html = document.documentElement;
    if (settings.theme === 'dark') {
      html.classList.add('dark');
    } else if (settings.theme === 'light') {
      html.classList.remove('dark');
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  }, [settings?.theme]);

  const handleUnitChange = async (unit: UnitSystem) => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await updateSettings({ unit_system: unit });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = async (theme: Theme) => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await updateSettings({ theme });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <SettingsNav title="Units & Theme" />

        {/* Save indicator */}
        <div className="h-6 mb-4 flex items-center">
          {saving && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          )}
          {saveSuccess && !saving && (
            <p className="text-sm text-green-600 font-medium">✓ Saved</p>
          )}
          {saveError && !saving && (
            <p className="text-sm text-red-600">{saveError}</p>
          )}
        </div>

        <div className="space-y-6">
          {/* Unit System */}
          <SettingsSection
            title="Unit System"
            description="Choose how measurements are displayed throughout the app"
          >
            <div className="space-y-2 mt-2">
              {(
                [
                  {
                    value: 'metric' as UnitSystem,
                    label: 'Metric',
                    description: 'Kilograms (kg), centimeters (cm)',
                  },
                  {
                    value: 'imperial' as UnitSystem,
                    label: 'Imperial',
                    description: 'Pounds (lbs), feet/inches (ft/in)',
                  },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    settings?.unit_system === option.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="unitSystem"
                    value={option.value}
                    checked={settings?.unit_system === option.value}
                    onChange={() => handleUnitChange(option.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{option.label}</p>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </SettingsSection>

          {/* Theme */}
          <SettingsSection
            title="Theme"
            description="Choose your preferred display theme"
          >
            <div className="space-y-2 mt-2">
              {(
                [
                  {
                    value: 'light' as Theme,
                    label: 'Light',
                    description: 'Always use light mode',
                    icon: '☀️',
                  },
                  {
                    value: 'dark' as Theme,
                    label: 'Dark',
                    description: 'Always use dark mode',
                    icon: '🌙',
                  },
                  {
                    value: 'system' as Theme,
                    label: 'System',
                    description: 'Follow your device settings',
                    icon: '💻',
                  },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    settings?.theme === option.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={option.value}
                    checked={settings?.theme === option.value}
                    onChange={() => handleThemeChange(option.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-base">{option.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{option.label}</p>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
