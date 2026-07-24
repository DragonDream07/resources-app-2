/**
 * Formats a numeric amount as Indian Rupee (₹) with locale-aware decimals.
 * @param {number} amount - The amount to format.
 * @param {object} [options] - Intl.NumberFormat options overrides.
 * @returns {string} Formatted currency string.
 */
export function formatCurrency(amount, options = {}) {
  const defaultOptions = {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  const mergedOptions = { ...defaultOptions, ...options };
  return new Intl.NumberFormat('en-IN', mergedOptions).format(amount);
}

/**
 * Formats a numeric amount as Indian Rupee (₹) without decimal places.
 * @param {number} amount - The amount to format.
 * @returns {string} Formatted currency string without decimals.
 */
export function formatCurrencyNoDecimals(amount) {
  return formatCurrency(amount, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
