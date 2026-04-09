import React from 'react';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

function LeafIcon() {
  return (
    <svg
      className="w-8 h-8 text-primary-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3s14 2 14 12c0 5.5-4.5 8-9 8C5 23 2 19 2 14 2 9 5 3 5 3zm0 0c0 0 4 4 4 11"
      />
    </svg>
  );
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <LeafIcon />
            <span className="text-2xl font-bold text-primary-700">
              NutriTrack
            </span>
          </div>
          <p className="text-sm text-primary-500">
            AI-powered nutrition tracking
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {title && (
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          )}
          {subtitle && (
            <p className="text-gray-500 text-sm mb-6">{subtitle}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
