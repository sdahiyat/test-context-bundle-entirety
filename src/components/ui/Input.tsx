'use client';

import React, { useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  id,
  name,
  className = '',
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || name || generatedId;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          name={name}
          className={[
            'block w-full rounded-lg border px-3 py-2 text-sm placeholder-gray-400',
            'focus:outline-none focus:ring-2',
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-600 text-xs mt-1">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-gray-500 text-xs mt-1">{helperText}</p>
      )}
    </div>
  );
}

export default Input;
