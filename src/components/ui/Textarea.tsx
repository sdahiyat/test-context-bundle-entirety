'use client';

import React, { useId, useState } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCount?: boolean;
  rows?: number;
  fullWidth?: boolean;
}

export function Textarea({
  label,
  error,
  helperText,
  maxLength,
  showCount = false,
  rows = 3,
  fullWidth = true,
  id,
  name,
  className = '',
  onChange,
  value,
  defaultValue,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id || name || generatedId;

  const [internalLength, setInternalLength] = useState<number>(() => {
    if (value !== undefined) return String(value).length;
    if (defaultValue !== undefined) return String(defaultValue).length;
    return 0;
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (showCount) {
      setInternalLength(e.target.value.length);
    }
    onChange?.(e);
  };

  const currentLength =
    value !== undefined ? String(value).length : internalLength;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        className={[
          'block w-full rounded-lg border px-3 py-2 text-sm placeholder-gray-400 resize-none',
          'focus:outline-none focus:ring-2',
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      <div className="flex justify-between items-start mt-1">
        <div>
          {error && <p className="text-red-600 text-xs">{error}</p>}
          {!error && helperText && (
            <p className="text-gray-500 text-xs">{helperText}</p>
          )}
        </div>
        {showCount && maxLength && (
          <p className="text-gray-400 text-xs text-right ml-auto">
            {currentLength}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

export default Textarea;
