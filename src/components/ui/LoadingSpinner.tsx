'use client';

import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type SpinnerColor = 'primary' | 'white' | 'gray';

export interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  overlay?: boolean;
  label?: string;
}

const sizeMap: Record<SpinnerSize, { container: string; border: string }> = {
  sm: { container: 'w-4 h-4', border: 'border-2' },
  md: { container: 'w-8 h-8', border: 'border-2' },
  lg: { container: 'w-12 h-12', border: 'border-4' },
  xl: { container: 'w-16 h-16', border: 'border-4' },
};

const colorMap: Record<SpinnerColor, string> = {
  primary: 'border-primary-600',
  white: 'border-white',
  gray: 'border-gray-400',
};

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  overlay = false,
  label = 'Loading...',
}: LoadingSpinnerProps) {
  const { container, border } = sizeMap[size];
  const colorClass = colorMap[color];

  const spinner = (
    <div
      role="status"
      aria-label={label}
      className={`${container} ${border} ${colorClass} border-t-transparent rounded-full animate-spin`}
    />
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
        {label && (
          <span className="sr-only">{label}</span>
        )}
      </div>
    );
  }

  return spinner;
}

export default LoadingSpinner;
