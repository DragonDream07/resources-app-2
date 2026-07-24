import { useEffect, useRef } from 'react';
import searchIcon from '@/assets/icons/search.svg';

function highlightMatch(text, query) {
  if (!query || !text) return text;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={index}
        style={{ backgroundColor: '#fef08a', color: 'inherit', padding: 0 }}
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function getSuggestionLabel(suggestion) {
  if (typeof suggestion === 'string') return suggestion;
  return suggestion.label || suggestion.name || suggestion.text || String(suggestion);
}

function getSuggestionType(suggestion) {
  if (typeof suggestion === 'string') return null;
  return suggestion.type || null;
}

function AutocompleteSuggestions({
  suggestions = [],
  query = '',
  isLoading = false,
  activeSuggestionIndex = -1,
  onSelect,
  onClose,
}) {
  const listRef = useRef(null);

  useEffect(() => {
    if (activeSuggestionIndex >= 0 && listRef.current) {
      const activeItem = listRef.current.querySelector(
        `[id="search-suggestion-${activeSuggestionIndex}"]`
      );
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeSuggestionIndex]);

  if (!isLoading && suggestions.length === 0) return null;

  return (
    <div
      className="autocomplete-suggestions-container"
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 1000,
        marginTop: '0.25rem',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        maxHeight: '24rem',
        overflowY: 'auto',
      }}
    >
      {isLoading && suggestions.length === 0 ? (
        <div
          className="autocomplete-loading"
          style={{
            padding: '0.875rem 1rem',
            fontSize: '0.875rem',
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          aria-live="polite"
          aria-busy="true"
        >
          <span
            style={{
              display: 'inline-block',
              width: '1rem',
              height: '1rem',
              border: '2px solid #e5e7eb',
              borderTopColor: '#6b7280',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
            }}
          />
          Loading suggestions…
        </div>
      ) : (
        <ul
          ref={listRef}
          id="search-autocomplete-listbox"
          role="listbox"
          aria-label="Search suggestions"
          className="autocomplete-suggestions-list"
          style={{ listStyle: 'none', margin: 0, padding: '0.25rem 0' }}
        >
          {suggestions.map((suggestion, index) => {
            const label = getSuggestionLabel(suggestion);
            const type = getSuggestionType(suggestion);
            const isActive = index === activeSuggestionIndex;

            return (
              <li
                key={index}
                id={`search-suggestion-${index}`}
                role="option"
                aria-selected={isActive}
                className={`autocomplete-suggestion-item${isActive ? ' autocomplete-suggestion-item--active' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect && onSelect(suggestion);
                }}
                onMouseEnter={() => {}}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.625rem 1rem',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#f3f4f6' : 'transparent',
                  fontSize: '0.9375rem',
                  color: '#111827',
                  transition: 'background-color 0.1s ease',
                }}
              >
                <img
                  src={searchIcon}
                  alt=""
                  width={14}
                  height={14}
                  aria-hidden="true"
                  style={{ flexShrink: 0, opacity: 0.45 }}
                />
                <span
                  className="autocomplete-suggestion-label"
                  style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {highlightMatch(label, query)}
                </span>
                {type && (
                  <span
                    className="autocomplete-suggestion-type"
                    style={{
                      fontSize: '0.75rem',
                      color: '#9ca3af',
                      flexShrink: 0,
                      textTransform: 'capitalize',
                    }}
                  >
                    {type}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .autocomplete-suggestion-item:hover {
          background-color: #f3f4f6 !important;
        }
      `}</style>
    </div>
  );
}

export default AutocompleteSuggestions;
