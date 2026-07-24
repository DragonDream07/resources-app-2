import React from 'react';

const Checkbox = React.forwardRef(function Checkbox(
  {
    id,
    label,
    error,
    className = '',
    ...rest
  },
  ref
) {
  const checkId = id || (label ? `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const errorId = checkId ? `${checkId}-error` : undefined;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          id={checkId}
          type="checkbox"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className={[
            'h-4 w-4 rounded border-gray-300 text-indigo-600',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-red-500' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {label && (
          <label
            htmlFor={checkId}
            className="text-sm text-gray-700 select-none cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

export default Checkbox;
