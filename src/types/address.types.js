/**
 * @fileoverview JSDoc type definitions for address domain.
 */

/**
 * @typedef {Object} Address
 * @property {string} id - UUID of the address
 * @property {string} user_id - UUID of the owning user
 * @property {string} full_name - Recipient's full name
 * @property {string} phone - Contact phone number
 * @property {string} line1 - Street address line 1
 * @property {string} [line2] - Street address line 2 (optional)
 * @property {string} city - City name
 * @property {string} state - State or province name
 * @property {string} pin_code - Postal / PIN code
 * @property {string} country - Country name or ISO code
 * @property {boolean} is_default - Whether this is the user's default address
 * @property {boolean} is_serviceable - Whether delivery is available to this pin_code
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */

export {};
