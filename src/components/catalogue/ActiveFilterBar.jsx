import React from 'react';
import closeIcon from '@/assets/icons/close.svg';

const Chip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
    <span>{label}</span>
    <button
      type="button"
      onClick={onRemove}
      className="ml-0.5 flex items-center justify-center w-4 h-4 rounded-full hover:bg-indigo-200 transition-colors"
      aria-label={`Remove filter: ${label}`}
    >
      <img src={closeIcon} alt="remove" className="w-3 h-3" />
    </button>
  </span>
);

const ActiveFilterBar = ({ filters = [], onRemove, onClearAll }) => {
  if (!filters.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="text-xs text-gray-500 font-medium uppercase tracking-wide whitespace-nowrap">
        Active filters:
      </span>
      {filters.map((filter) => (
        <Chip
          key={`${filter.type}-${filter.value}`}
          label={filter.label}
          onRemove={() => onRemove && onRemove(filter)}
        />
      ))}
      {filters.length > 1 && onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-red-500 hover:text-red-700 font-medium underline ml-1"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default ActiveFilterBar;
