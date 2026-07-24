import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '@/assets/icons/search.svg';
import closeIcon from '@/assets/icons/close.svg';
import AutocompleteSuggestions from './AutocompleteSuggestions';

const DEBOUNCE_DELAY = 300;

function SearchBar({ placeholder = 'Search for products...', className = '' }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const navigate = useNavigate();

  const fetchSuggestions = useCallback(async (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({ q: value.trim() });
      const response = await fetch(`/search/suggest?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      const results = Array.isArray(data) ? data : (data.suggestions || data.data || []);
      setSuggestions(results);
      setIsOpen(results.length > 0);
    } catch {
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setActiveSuggestionIndex(-1);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, DEBOUNCE_DELAY);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const searchTerm = query.trim();
    if (!searchTerm) return;
    closeSuggestions();
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleSuggestionSelect = (suggestion) => {
    const label = typeof suggestion === 'string' ? suggestion : (suggestion.label || suggestion.name || suggestion.text || '');
    setQuery(label);
    closeSuggestions();
    navigate(`/search?q=${encodeURIComponent(label)}`);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter') handleSubmit();
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[activeSuggestionIndex]);
        } else {
          handleSubmit();
        }
        break;
      case 'Escape':
        closeSuggestions();
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const closeSuggestions = () => {
    setIsOpen(false);
    setActiveSuggestionIndex(-1);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setActiveSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeSuggestions();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`search-bar-container ${className}`}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%' }}
    >
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Site search"
        style={{ display: 'flex', alignItems: 'center', width: '100%' }}
      >
        <div
          className="search-bar-input-wrapper"
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
          }}
        >
          <button
            type="submit"
            aria-label="Submit search"
            className="search-bar-icon-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 0.75rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <img src={searchIcon} alt="" width={18} height={18} aria-hidden="true" />
          </button>

          <input
            ref={inputRef}
            type="text"
            className="search-bar-input"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
            placeholder={placeholder}
            autoComplete="off"
            aria-label="Search"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls={isOpen ? 'search-autocomplete-listbox' : undefined}
            aria-activedescendant={
              activeSuggestionIndex >= 0
                ? `search-suggestion-${activeSuggestionIndex}`
                : undefined
            }
            role="combobox"
            style={{
              flex: 1,
              padding: '0.625rem 0.25rem',
              border: 'none',
              outline: 'none',
              fontSize: '0.9375rem',
              backgroundColor: 'transparent',
              color: '#111827',
              minWidth: 0,
            }}
          />

          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={handleClear}
              className="search-bar-clear-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 0.75rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <img src={closeIcon} alt="" width={16} height={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </form>

      {isOpen && (
        <AutocompleteSuggestions
          suggestions={suggestions}
          query={query}
          isLoading={isLoading}
          activeSuggestionIndex={activeSuggestionIndex}
          onSelect={handleSuggestionSelect}
          onClose={closeSuggestions}
        />
      )}
    </div>
  );
}

export default SearchBar;
