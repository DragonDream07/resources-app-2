import React from 'react';

const ResultCount = ({
  total = 0,
  page = 1,
  pageSize = 20,
  facetCounts = {},
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32" />
      </div>
    );
  }

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const hasFacets =
    facetCounts && Object.keys(facetCounts).length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-gray-600">
        {total === 0 ? (
          'No results found'
        ) : (
          <>
            Showing{' '}
            <span className="font-semibold text-gray-800">
              {start}–{end}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-gray-800">{total}</span>{' '}
            result{total !== 1 ? 's' : ''}
          </>
        )}
      </span>

      {hasFacets && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(facetCounts).map(([label, count]) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              <span className="font-medium capitalize">{label}</span>
              <span className="text-gray-400">({count})</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultCount;
