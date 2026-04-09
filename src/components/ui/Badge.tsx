import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

const dotColorClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-500',
  primary: 'bg-primary-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-500',
  danger: 'bg-red-600',
  info: 'bg-blue-600',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs rounded-full font-medium',
  md: 'px-3 py-1 text-sm rounded-full font-medium',
};

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Badge({
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
  children,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {dot && (
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColorClasses[variant]}`}
        />
      )}
      {children}
    </span>
  );
}

export default Badge;
