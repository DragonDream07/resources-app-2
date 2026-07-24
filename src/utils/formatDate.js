/**
 * Formats an ISO date string to a human-readable display string.
 * @param {string} isoDate - ISO 8601 date string.
 * @param {object} [options] - Intl.DateTimeFormat options overrides.
 * @returns {string} Formatted date string.
 */
export function formatDate(isoDate, options = {}) {
  if (!isoDate) return '';
  const defaultOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  const mergedOptions = { ...defaultOptions, ...options };
  return new Intl.DateTimeFormat('en-IN', mergedOptions).format(new Date(isoDate));
}

/**
 * Formats an ISO date string to include time.
 * @param {string} isoDate - ISO 8601 date string.
 * @returns {string} Formatted date-time string.
 */
export function formatDateTime(isoDate) {
  if (!isoDate) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(isoDate));
}

/**
 * Formats an ISO date string to a short date (DD/MM/YYYY).
 * @param {string} isoDate - ISO 8601 date string.
 * @returns {string} Short date string.
 */
export function formatShortDate(isoDate) {
  if (!isoDate) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoDate));
}

/**
 * Returns a relative time string (e.g., "2 days ago").
 * @param {string} isoDate - ISO 8601 date string.
 * @returns {string} Relative time string.
 */
export function formatRelativeTime(isoDate) {
  if (!isoDate) return '';
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  return formatDate(isoDate);
}
