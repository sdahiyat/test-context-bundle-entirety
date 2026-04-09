import React from 'react';

type CardVariant = 'default' | 'outlined' | 'elevated';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white rounded-2xl border border-gray-100 shadow-sm',
  outlined: 'bg-white rounded-2xl border border-gray-200',
  elevated: 'bg-white rounded-2xl shadow-md',
};

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
  children?: React.ReactNode;
}

export function Card({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
}: CardProps) {
  return (
    <div
      className={`${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

// ---- Sub-components -------------------------------------------------------

export interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = '',
  children,
}: CardHeaderProps) {
  return (
    <div className={`px-4 pt-4 pb-0 flex items-start justify-between ${className}`}>
      <div>
        {title && (
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        )}
        {children}
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  );
}

export interface CardBodyProps {
  className?: string;
  children?: React.ReactNode;
}

export function CardBody({ className = '', children }: CardBodyProps) {
  return (
    <div className={`flex-1 p-4 ${className}`}>
      {children}
    </div>
  );
}

export interface CardFooterProps {
  className?: string;
  children?: React.ReactNode;
}

export function CardFooter({ className = '', children }: CardFooterProps) {
  return (
    <div className={`px-4 pb-4 border-t border-gray-100 pt-3 ${className}`}>
      {children}
    </div>
  );
}

export default Card;
