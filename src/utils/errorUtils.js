/**
 * Default fallback error message.
 */
export const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

/**
 * Parses an API error response (Axios-style or fetch Response) into a
 * user-facing message string.
 *
 * Handles:
 * - Axios error objects with response.data.message
 * - Axios error objects with response.data.errors array
 * - Plain Error objects
 * - Raw strings
 * - Network/timeout errors
 *
 * @param {unknown} error - The error caught in a try/catch block.
 * @returns {string} A user-facing error message.
 */
export function parseApiError(error) {
  if (!error) return DEFAULT_ERROR_MESSAGE;

  // Plain string
  if (typeof error === 'string') return error || DEFAULT_ERROR_MESSAGE;

  // Axios-style error with response payload
  if (error.response) {
    const data = error.response.data;
    if (data) {
      // Validation errors array
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors
          .map((e) => (typeof e === 'string' ? e : e.message || e.msg || JSON.stringify(e)))
          .join(' ');
      }
      if (typeof data.message === 'string' && data.message) {
        return data.message;
      }
      if (typeof data.error === 'string' && data.error) {
        return data.error;
      }
    }
    // HTTP status fallback
    return getHttpStatusMessage(error.response.status);
  }

  // Network error (no response)
  if (error.request) {
    return 'Network error. Please check your internet connection.';
  }

  // Standard Error object
  if (error instanceof Error || typeof error.message === 'string') {
    return error.message || DEFAULT_ERROR_MESSAGE;
  }

  return DEFAULT_ERROR_MESSAGE;
}

/**
 * Parses an API error response into an array of field-level error messages
 * suitable for form validation display.
 *
 * @param {unknown} error - The error caught in a try/catch block.
 * @returns {Array<{ field: string, message: string }>} Array of field errors.
 */
export function parseFieldErrors(error) {
  if (!error || !error.response || !error.response.data) return [];
  const data = error.response.data;
  if (!Array.isArray(data.errors)) return [];
  return data.errors
    .filter((e) => e && (e.field || e.param || e.path))
    .map((e) => ({
      field: e.field || e.param || e.path || 'unknown',
      message: e.message || e.msg || String(e),
    }));
}

/**
 * Returns a user-facing message for common HTTP status codes.
 * @param {number} status - HTTP status code.
 * @returns {string}
 */
export function getHttpStatusMessage(status) {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'You are not logged in. Please log in and try again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'A conflict occurred. The resource may already exist.';
    case 422:
      return 'The submitted data is invalid. Please review and try again.';
    case 429:
      return 'Too many requests. Please slow down and try again later.';
    case 500:
      return 'A server error occurred. Please try again later.';
    case 502:
    case 503:
    case 504:
      return 'The service is temporarily unavailable. Please try again later.';
    default:
      return DEFAULT_ERROR_MESSAGE;
  }
}

/**
 * Returns true if the error represents an authentication failure (401).
 * @param {unknown} error
 * @returns {boolean}
 */
export function isUnauthorizedError(error) {
  return error?.response?.status === 401;
}

/**
 * Returns true if the error represents a forbidden action (403).
 * @param {unknown} error
 * @returns {boolean}
 */
export function isForbiddenError(error) {
  return error?.response?.status === 403;
}

/**
 * Returns true if the error represents a not-found response (404).
 * @param {unknown} error
 * @returns {boolean}
 */
export function isNotFoundError(error) {
  return error?.response?.status === 404;
}
