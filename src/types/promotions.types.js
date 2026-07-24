/**
 * @fileoverview JSDoc type definitions for promotions domain.
 */

/**
 * @typedef {'percentage' | 'flat'} DiscountType
 */

/**
 * @typedef {Object} PromoCode
 * @property {string} id - UUID of the promo code
 * @property {string} code - The promo code string users enter at checkout
 * @property {DiscountType} discount_type - Whether the discount is a percentage or flat amount
 * @property {number} discount_value - Discount value; percentage (0–100) or flat amount (minor units)
 * @property {number} [min_order_value] - Minimum order value required to use this code (minor units)
 * @property {number} [max_uses] - Maximum number of times this code can be used in total
 * @property {number} uses_count - Number of times this code has been used so far
 * @property {boolean} is_active - Whether the promo code is currently active
 * @property {string | null} expires_at - ISO timestamp of code expiry, or null if non-expiring
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */

export {};
