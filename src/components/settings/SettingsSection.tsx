import React from 'react';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
}

export default function SettingsSection({
  title,
  description,
  children,
  danger = false,
}: SettingsSectionProps) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        danger ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="mb-3">
        <h2
          className={`text-xs font-semibold uppercase tracking-wide ${
            danger ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          {title}
        </h2>
        {description && (
          <p className={`text-sm mt-1 ${danger ? 'text-red-500' : 'text-gray-500'}`}>
            {description}
          </p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
