'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

export interface TopBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

export function TopBar({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  transparent = false,
}: TopBarProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header
      className={
        transparent
          ? 'bg-transparent absolute inset-x-0 top-0 z-30'
          : 'bg-white border-b border-gray-200 shadow-sm'
      }
    >
      <div className="flex items-center h-14 px-4 gap-3 max-w-lg mx-auto">
        {/* Back button */}
        {showBack && (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Go back"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Title area */}
        <div className="flex-1 min-w-0">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xs text-gray-500 truncate">{subtitle}</p>
          )}
        </div>

        {/* Right action slot */}
        {rightAction && (
          <div className="flex-shrink-0">{rightAction}</div>
        )}
      </div>
    </header>
  );
}

export default TopBar;
