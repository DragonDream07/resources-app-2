/**
 * @fileoverview JSDoc type definitions for order domain.
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} id - UUID of the order item
 * @property {string} order_id - UUID of the owning order
 * @property {string} sku_id - UUID of the purchased SKU
 * @property {number} quantity - Quantity ordered
 * @property {number} unit_price - Price per unit at time of purchase (minor units)
 * @property {number} subtotal - quantity * unit_price (minor units)
 * @property {Object} [sku] - Hydrated SKU with product info
 */

/**
 * @typedef {Object} OrderStatusHistory
 * @property {string} id - UUID of the history record
 * @property {string} order_id - UUID of the related order
 * @property {string} status - The status value at this point in time
 * @property {string} [notes] - Optional human-readable notes
 * @property {string} [changed_by] - UUID of the user who triggered the change
 * @property {string} created_at - ISO timestamp when the status was recorded
 */

/**
 * @typedef {Object} OrderTracking
 * @property {string} id - UUID of the tracking record
 * @property {string} order_id - UUID of the related order
 * @property {string} carrier - Carrier/courier name
 * @property {string} tracking_number - Carrier tracking number
 * @property {string} [tracking_url] - Deep-link URL to carrier tracking page
 * @property {string} [estimated_delivery] - ISO date string for estimated delivery
 * @property {string} created_at - ISO timestamp of record creation
 * @property {string} updated_at - ISO timestamp of last update
 */

/**
 * @typedef {Object} Order
 * @property {string} id - UUID of the order
 * @property {string} user_id - UUID of the purchasing user
 * @property {string} status - Current order status
 * @property {string} address_id - UUID of the delivery address
 * @property {string|null} promo_code_id - UUID of the applied promo code, if any
 * @property {number} subtotal - Pre-discount total (minor units)
 * @property {number} discount_amount - Discount applied (minor units)
 * @property {number} total - Final charged amount (minor units)
 * @property {OrderItem[]} [items] - Hydrated order items
 * @property {Object} [address] - Hydrated delivery address
 * @property {OrderStatusHistory[]} [status_history] - Timeline of status changes
 * @property {OrderTracking} [tracking] - Shipment tracking info
 * @property {string} created_at - ISO timestamp of order placement
 * @property {string} updated_at - ISO timestamp of last update
 */

export {};
