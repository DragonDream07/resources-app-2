/**
 * @fileoverview JSDoc type definitions for returns domain.
 */

/**
 * @typedef {'pending' | 'approved' | 'rejected' | 'completed'} ReturnStatus
 */

/**
 * @typedef {Object} ReturnRequest
 * @property {string} id - UUID of the return request
 * @property {string} order_id - UUID of the order being returned
 * @property {string} user_id - UUID of the requesting user
 * @property {string} reason - Customer-provided reason for the return
 * @property {ReturnStatus} status - Current status of the return request
 * @property {string} [admin_notes] - Notes added by admin during review
 * @property {string} [reviewed_by] - UUID of the admin who reviewed the request
 * @property {string} [reviewed_at] - ISO timestamp of review action
 * @property {string} created_at - ISO timestamp of request creation
 * @property {string} updated_at - ISO timestamp of last update
 */

/**
 * @typedef {'pending' | 'processed' | 'failed'} RefundStatus
 */

/**
 * @typedef {Object} Refund
 * @property {string} id - UUID of the refund record
 * @property {string} order_id - UUID of the related order
 * @property {string} [return_request_id] - UUID of the associated return request, if applicable
 * @property {number} amount - Refund amount in minor currency units
 * @property {RefundStatus} status - Current status of the refund
 * @property {string} [gateway_reference] - Reference from the payment gateway
 * @property {string} [notes] - Additional notes about the refund
 * @property {string} created_at - ISO timestamp of refund record creation
 * @property {string} updated_at - ISO timestamp of last update
 */

export {};
