export interface UserSettings {
  id?: string;
  user_id: string;
  unit_system: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'system';
  notifications_daily_reminder: boolean;
  notifications_weekly_summary: boolean;
  notifications_achievements: boolean;
  notifications_tips: boolean;
  created_at?: string;
  updated_at?: string;
}

export type UnitSystem = 'metric' | 'imperial';
export type Theme = 'light' | 'dark' | 'system';

export const DEFAULT_SETTINGS: Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  unit_system: 'metric',
  theme: 'system',
  notifications_daily_reminder: true,
  notifications_weekly_summary: true,
  notifications_achievements: true,
  notifications_tips: true,
};
