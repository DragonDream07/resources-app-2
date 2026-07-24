import { useState, useEffect, useCallback, useRef } from 'react';

const DEBOUNCE_MS = 300;

async function callSearch(query, params = {}) {
  const url = new URL('/search', window.location.origin);
  url.searchParams.set('q', query);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

async function callSuggest(query) {
  const url = new URL('/search/suggest', window.location.origin);
  url.searchParams.set('q', query);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Suggest failed');
  return res.json();
}

export function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);

  const search = useCallback(async (q, params = {}) => {
    if (!q || !q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await callSearch(q, params);
      setResults(data.data || data.results || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuggestions = useCallback((q) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!q || !q.trim()) {
      setSuggestions([]);
      return;
    }
    debounceTimer.current = setTimeout(async () => {
      try {
        const data = await callSuggest(q);
        setSuggestions(data.data || data.suggestions || data || []);
      } catch {
        setSuggestions([]);
      }
    }, DEBOUNCE_MS);
  }, []);

  const updateQuery = useCallback(
    (q) => {
      setQuery(q);
      fetchSuggestions(q);
    },
    [fetchSuggestions]
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return {
    query,
    setQuery: updateQuery,
    results,
    suggestions,
    loading,
    error,
    search,
  };
}
