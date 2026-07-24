/**
 * @fileoverview JSDoc type definitions for checkout domain.
 */

/**
 * @typedef {Object} CheckoutInitiatePayload
 * @property {string} cart_id - UUID of the cart to check out
 * @property {string} address_id - UUID of the delivery address
 */

/**
 * @typedef {Object} CheckoutConfirmPayload
 * @property {string} cart_id - UUID of the cart being confirmed
 * @property {string} address_id - UUID of the confirmed delivery address
 * @property {string} [promo_code] - Optional promo code to apply at confirmation
 * @property {string} payment_method - Payment method identifier (e.g. 'MOCK', 'RAZORPAY')
 */

export {};
