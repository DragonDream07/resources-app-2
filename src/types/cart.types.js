/**
 * @fileoverview JSDoc type definitions for cart domain.
 */

/**
 * @typedef {Object} CartItem
 * @property {string} id - UUID of the cart item
 * @property {string} cart_id - UUID of the owning cart
 * @property {string} sku_id - UUID of the selected SKU
 * @property {number} quantity - Quantity added to cart
 * @property {number} unit_price - Price per unit at time of adding (minor units)
 * @property {Object} [sku] - Hydrated SKU object
 * @property {Object} [product] - Hydrated parent product (name, images, etc.)
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */

/**
 * @typedef {Object} Cart
 * @property {string} id - UUID of the cart
 * @property {string|null} user_id - UUID of the owning user, or null for guest carts
 * @property {string|null} promo_code_id - UUID of the applied promo code
 * @property {string|null} promo_code - The applied promo code string (denormalised)
 * @property {number} subtotal - Sum of (unit_price * quantity) for all items (minor units)
 * @property {number} discount_amount - Total discount applied (minor units)
 * @property {number} total - Final total after discount (minor units)
 * @property {CartItem[]} items - Array of cart items
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */

export {};
