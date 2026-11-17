import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  className,
  id,
  onBlur,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const errorId = inputId ? `${inputId}-error` : undefined;
  const hintId = inputId ? `${inputId}-hint` : undefined;

  const describedBy = [
    error && errorId,
    !error && hint && hintId,
  ].filter(Boolean).join(' ') || undefined;

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Trim whitespace on blur
    const trimmed = e.target.value.trim();
    if (trimmed !== e.target.value) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeInputValueSetter?.call(e.target, trimmed);
      e.target.dispatchEvent(new Event('input', { bubbles: true }));
    }
    onBlur?.(e);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onBlur={handleBlur}
        className={clsx(
          'flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
          'shadow-sm transition-colors placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:ring-red-500',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="text-xs text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
};
