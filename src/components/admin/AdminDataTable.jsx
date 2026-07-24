import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const SortIcon = ({ direction }) => {
  if (!direction) return <span className="ml-1 text-gray-300">⇅</span>;
  return <span className="ml-1">{direction === 'asc' ? '↑' : '↓'}</span>;
};

const AdminDataTable = ({
  columns,
  data,
  loading,
  emptyMessage,
  pageSize,
  totalCount,
  currentPage,
  onPageChange,
  serverSide,
  onSort,
  rowKey,
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [clientPage, setClientPage] = useState(1);

  const effectivePage = serverSide ? currentPage : clientPage;
  const effectiveTotal = serverSide ? totalCount : data.length;
  const totalPages = Math.max(1, Math.ceil(effectiveTotal / pageSize));

  const sortedData = useMemo(() => {
    if (serverSide || !sortField) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal === bVal) return 0;
      const cmp = aVal > bVal ? 1 : -1;
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [data, sortField, sortDirection, serverSide]);

  const pagedData = useMemo(() => {
    if (serverSide) return sortedData;
    const start = (clientPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, clientPage, pageSize, serverSide]);

  const handleSort = (field, sortable) => {
    if (!sortable) return;
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    if (serverSide && onSort) onSort(field, newDirection);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    if (serverSide) {
      onPageChange?.(page);
    } else {
      setClientPage(page);
    }
  };

  const getKey = (row, index) => {
    if (rowKey) return typeof rowKey === 'function' ? rowKey(row) : row[rowKey];
    return index;
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap select-none ${
                    col.sortable ? 'cursor-pointer hover:text-indigo-700' : ''
                  } ${col.headerClassName ?? ''}`}
                  onClick={() => handleSort(col.key, col.sortable)}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                  {col.sortable && (
                    <SortIcon
                      direction={sortField === col.key ? sortDirection : null}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : pagedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-400">
                  {emptyMessage ?? 'No records found.'}
                </td>
              </tr>
            ) : (
              pagedData.map((row, index) => (
                <tr key={getKey(row, index)} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-gray-800 ${col.cellClassName ?? ''}`}>
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>
            Page {effectivePage} of {totalPages}
            {effectiveTotal > 0 && ` · ${effectiveTotal} total`}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(1)}
              disabled={effectivePage === 1}
              className="px-2 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
            >
              «
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(effectivePage - 1)}
              disabled={effectivePage === 1}
              className="px-2 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
            >
              ‹
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const startPage = Math.max(1, Math.min(effectivePage - 2, totalPages - 4));
              const page = startPage + i;
              if (page > totalPages) return null;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded border transition-colors ${
                    page === effectivePage
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handlePageChange(effectivePage + 1)}
              disabled={effectivePage === totalPages}
              className="px-2 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
            >
              ›
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(totalPages)}
              disabled={effectivePage === totalPages}
              className="px-2 py-1 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

AdminDataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func,
      width: PropTypes.string,
      headerClassName: PropTypes.string,
      cellClassName: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  pageSize: PropTypes.number,
  totalCount: PropTypes.number,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func,
  serverSide: PropTypes.bool,
  onSort: PropTypes.func,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

AdminDataTable.defaultProps = {
  data: [],
  loading: false,
  pageSize: 20,
  totalCount: 0,
  currentPage: 1,
  serverSide: false,
};

export default AdminDataTable;
