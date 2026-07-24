/**
 * Free shipping threshold in Indian Rupees.
 */
export const FREE_SHIPPING_THRESHOLD = 799;

/**
 * Standard shipping charge in Indian Rupees.
 */
export const STANDARD_SHIPPING_CHARGE = 49;

/**
 * Computes the shipping charge based on the order total.
 * Returns ₹0 if the total is ≥ ₹799, otherwise ₹49.
 * @param {number} orderTotal - The total order amount in ₹.
 * @returns {number} Shipping charge (0 or 49).
 */
export function computeShippingCharge(orderTotal) {
  return orderTotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_CHARGE;
}

/**
 * Returns whether the given order total qualifies for free shipping.
 * @param {number} orderTotal - The total order amount in ₹.
 * @returns {boolean}
 */
export function isFreeShipping(orderTotal) {
  return orderTotal >= FREE_SHIPPING_THRESHOLD;
}

/**
 * Returns how much more the user needs to spend to qualify for free shipping.
 * @param {number} orderTotal - The total order amount in ₹.
 * @returns {number} Remaining amount needed, or 0 if already qualifies.
 */
export function amountUntilFreeShipping(orderTotal) {
  const remaining = FREE_SHIPPING_THRESHOLD - orderTotal;
  return remaining > 0 ? remaining : 0;
}
