import { useState, useCallback, useMemo } from 'react';

const DEFAULT_FILTERS = {
  category: null,
  brand: null,
  minPrice: null,
  maxPrice: null,
  sort: null,
  inStock: null,
};

export function useFilters(initialFilters = {}) {
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initialFilters });

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

  const toggleFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const current = prev[key];
      if (Array.isArray(current)) {
        return {
          ...prev,
          [key]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      }
      return { ...prev, [key]: current === value ? null : value };
    });
  }, []);

  const queryParams = useMemo(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          params[key] = value.join(',');
        } else if (!Array.isArray(value)) {
          params[key] = value;
        }
      }
    });
    return params;
  }, [filters]);

  const activeFilters = useMemo(() => {
    return Object.entries(filters)
      .filter(([, value]) => {
        if (value === null || value === undefined || value === '') return false;
        if (Array.isArray(value)) return value.length > 0;
        return true;
      })
      .map(([key, value]) => ({ key, value }));
  }, [filters]);

  return {
    filters,
    setFilter,
    resetFilters,
    toggleFilter,
    queryParams,
    activeFilters,
  };
}
