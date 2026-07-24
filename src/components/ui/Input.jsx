import React from 'react';

const Input = React.forwardRef(function Input(
  {
    id,
    label,
    error,
    helpText,
    type = 'text',
    className = '',
    required = false,
    ...rest
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const errorId = inputId ? `${inputId}-error` : undefined;
  const helpId = inputId ? `${inputId}-help` : undefined;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          [error ? errorId : null, helpText ? helpId : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        className={[
          'block w-full rounded-md border px-3 py-2 text-sm shadow-sm',
          'placeholder-gray-400 text-gray-900',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
          'disabled:cursor-not-allowed disabled:bg-gray-100',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
      {helpText && !error && (
        <p id={helpId} className="text-xs text-gray-500">
          {helpText}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
