import Link from 'next/link';
import React from 'react';

interface SettingsRowProps {
  label: string;
  description?: string;
  href: string;
  icon?: React.ReactNode;
}

export default function SettingsRow({ label, description, href, icon }: SettingsRowProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 py-3 px-1 hover:bg-gray-50 rounded-lg transition-colors group -mx-1"
    >
      {icon && (
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-500">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
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
        className="text-gray-400 flex-shrink-0 group-hover:text-gray-600 transition-colors"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </Link>
  );
}
