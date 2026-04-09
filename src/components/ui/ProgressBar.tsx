import React from 'react';

type ProgressColor = 'primary' | 'green' | 'blue' | 'orange' | 'red';
type ProgressSize = 'sm' | 'md';

const colorClasses: Record<ProgressColor, string> = {
  primary: 'bg-primary-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
};

const sizeClasses: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
};

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  sublabel?: string;
  color?: ProgressColor;
  size?: ProgressSize;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max,
  label,
  sublabel,
  color = 'primary',
  size = 'md',
  showPercentage = false,
  className = '',
}: ProgressBarProps) {
  const percentage = max !== undefined ? (value / (max || 1)) * 100 : value;
  const clampedPct = Math.min(Math.max(percentage, 0), 100);
  const isOverLimit = percentage > 100;

  const barColor = isOverLimit ? 'bg-red-500' : colorClasses[color];

  return (
    <div className={`w-full ${className}`}>
      {(label || sublabel || showPercentage) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {sublabel && (
              <span className="text-xs text-gray-500">{sublabel}</span>
            )}
            {showPercentage && (
              <span className="text-xs font-medium text-gray-700">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        </div>
      )}
      <div
        className={`bg-gray-100 rounded-full overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          className={`${barColor} ${sizeClasses[size]} rounded-full transition-all duration-300`}
          style={{ width: `${clampedPct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max ?? 100}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
