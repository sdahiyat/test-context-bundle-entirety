import React from 'react';

type RingSize = 'sm' | 'md' | 'lg';

export interface MacroRingProps {
  consumed: number;
  goal: number;
  label?: string;
  color?: string;
  size?: RingSize;
  showLabel?: boolean;
}

interface RingConfig {
  svgSize: number;
  r: number;
  stroke: number;
}

const sizeConfig: Record<RingSize, RingConfig> = {
  sm: { svgSize: 60, r: 24, stroke: 4 },
  md: { svgSize: 100, r: 40, stroke: 6 },
  lg: { svgSize: 140, r: 56, stroke: 8 },
};

const valueFontSize: Record<RingSize, string> = {
  sm: 'text-xs',
  md: 'text-base',
  lg: 'text-xl',
};

const goalFontSize: Record<RingSize, string> = {
  sm: 'text-[8px]',
  md: 'text-xs',
  lg: 'text-sm',
};

export function MacroRing({
  consumed,
  goal,
  label,
  color = '#22c55e',
  size = 'md',
  showLabel = true,
}: MacroRingProps) {
  const { svgSize, r, stroke } = sizeConfig[size];
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const circumference = 2 * Math.PI * r;
  const progress = Math.min(consumed / (goal || 1), 1) * circumference;
  const offset = circumference - progress;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          aria-label={label ? `${label}: ${consumed} of ${goal}` : undefined}
          role={label ? 'img' : undefined}
        >
          {/* Background circle */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={stroke}
          />
          {/* Progress circle */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold text-gray-900 leading-none ${valueFontSize[size]}`}>
            {Math.round(consumed)}
          </span>
          <span className={`text-gray-400 leading-none mt-0.5 ${goalFontSize[size]}`}>
            /{goal}
          </span>
        </div>
      </div>

      {showLabel && label && (
        <span className="text-xs text-gray-500 text-center leading-tight">
          {label}
        </span>
      )}
    </div>
  );
}

export default MacroRing;
