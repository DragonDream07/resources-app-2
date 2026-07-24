/**
 * Default GST rate used across the application.
 */
export const DEFAULT_GST_RATE = 0.18;

/**
 * Derives a GST-inclusive display price from a base (exclusive) price.
 * @param {number} basePrice - Price excluding GST.
 * @param {number} [gstRate=DEFAULT_GST_RATE] - GST rate as a decimal (e.g., 0.18 for 18%).
 * @returns {number} GST-inclusive price.
 */
export function getInclusivePrice(basePrice, gstRate = DEFAULT_GST_RATE) {
  return basePrice * (1 + gstRate);
}

/**
 * Extracts the tax portion from a GST-inclusive price.
 * @param {number} inclusivePrice - Price including GST.
 * @param {number} [gstRate=DEFAULT_GST_RATE] - GST rate as a decimal (e.g., 0.18 for 18%).
 * @returns {number} Tax amount embedded in the inclusive price.
 */
export function extractTaxFromInclusive(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  return inclusivePrice - inclusivePrice / (1 + gstRate);
}

/**
 * Extracts the base (exclusive) price from a GST-inclusive price.
 * @param {number} inclusivePrice - Price including GST.
 * @param {number} [gstRate=DEFAULT_GST_RATE] - GST rate as a decimal.
 * @returns {number} Base price before GST.
 */
export function extractBaseFromInclusive(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  return inclusivePrice / (1 + gstRate);
}

/**
 * Builds a full tax breakdown object for display.
 * @param {number} inclusivePrice - Price including GST.
 * @param {number} [gstRate=DEFAULT_GST_RATE] - GST rate as a decimal.
 * @returns {{ basePrice: number, taxAmount: number, totalPrice: number, gstRate: number, cgst: number, sgst: number }}
 */
export function getTaxBreakdown(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  const taxAmount = extractTaxFromInclusive(inclusivePrice, gstRate);
  const basePrice = extractBaseFromInclusive(inclusivePrice, gstRate);
  return {
    basePrice,
    taxAmount,
    totalPrice: inclusivePrice,
    gstRate,
    cgst: taxAmount / 2,
    sgst: taxAmount / 2,
  };
}
