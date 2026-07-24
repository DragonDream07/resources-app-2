/**
 * @fileoverview JSDoc type definitions for notifications domain.
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - UUID of the notification
 * @property {string} user_id - UUID of the recipient user
 * @property {string} title - Short notification title
 * @property {string} body - Full notification body text
 * @property {string} [type] - Notification category/type (e.g. 'order_update', 'promotion')
 * @property {boolean} is_read - Whether the user has read this notification
 * @property {Object} [metadata] - Arbitrary extra data (e.g. order_id reference)
 * @property {string} created_at - ISO timestamp of notification creation
 * @property {string} updated_at - ISO timestamp of last update
 */

export {};
