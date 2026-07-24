/**
 * @fileoverview JSDoc type definitions for payment domain.
 */

/**
 * @typedef {'pending' | 'success' | 'failure' | 'refunded'} PaymentStatus
 */

/**
 * @typedef {Object} PaymentAttempt
 * @property {string} id - UUID of the payment attempt
 * @property {string} order_id - UUID of the related order
 * @property {string} payment_method - Payment method identifier used
 * @property {number} amount - Amount charged in minor currency units
 * @property {PaymentStatus} status - Current status of this attempt
 * @property {string} [gateway_reference] - Reference ID from the payment gateway
 * @property {Object} [gateway_response] - Raw gateway response payload
 * @property {string} created_at - ISO timestamp of attempt creation
 * @property {string} updated_at - ISO timestamp of last update
 */

/**
 * @typedef {Object} PaymentOutcome
 * @property {'success' | 'failure' | 'pending'} outcome - Result of the payment attempt
 * @property {string} order_id - UUID of the associated order
 * @property {string} payment_attempt_id - UUID of the payment attempt record
 * @property {string} [message] - Human-readable outcome message
 * @property {string} [gateway_reference] - Gateway reference for successful payments
 */

export {};
