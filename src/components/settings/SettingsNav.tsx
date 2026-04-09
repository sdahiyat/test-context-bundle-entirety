'use client';

import Link from 'next/link';

interface SettingsNavProps {
  title: string;
  backHref?: string;
}

export default function SettingsNav({ title, backHref = '/settings' }: SettingsNavProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Link
        href={backHref}
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </Link>
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
    </div>
  );
}
