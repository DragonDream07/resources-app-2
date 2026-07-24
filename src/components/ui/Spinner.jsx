import React from 'react';

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-4',
};

function Spinner({ size = 'md', className = '', label = 'Loading…' }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <span
        className={[
          'animate-spin rounded-full',
          'border-gray-200 border-t-indigo-600',
          sizeClasses[size] ?? sizeClasses.md,
        ].join(' ')}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default Spinner;
