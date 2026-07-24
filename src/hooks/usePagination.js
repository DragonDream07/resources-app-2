import { useState, useCallback } from 'react';

export function usePagination({ initialPage = 1, initialLimit = 20 } = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const goToPage = useCallback(
    (p) => {
      const clamped = Math.max(1, Math.min(p, totalPages));
      setPage(clamped);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
    setTotal(0);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    total,
    totalPages,
    setTotal,
    goToPage,
    nextPage,
    prevPage,
    changeLimit,
    reset,
  };
}
