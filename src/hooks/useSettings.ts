'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserSettings } from '@/types/settings';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const response = await fetch('/api/settings/preferences');
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const updateSettings = useCallback(
    async (partial: Partial<UserSettings>): Promise<void> => {
      const previousSettings = settings;

      // Optimistic update
      setSettings((prev) => (prev ? { ...prev, ...partial } : null));

      try {
        const response = await fetch('/api/settings/preferences', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partial),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update settings');
        }

        const updatedSettings = await response.json();
        setSettings(updatedSettings);

        // Sync theme to localStorage for flash prevention
        if (partial.theme) {
          localStorage.setItem('theme', partial.theme);
        }
      } catch (err) {
        // Revert on error
        setSettings(previousSettings);
        throw err;
      }
    },
    [settings]
  );

  return { settings, loading, error, updateSettings };
}
