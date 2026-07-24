/**
 * @fileoverview JSDoc type definitions for catalogue domain.
 */

/**
 * @typedef {Object} ProductImage
 * @property {string} id - UUID of the image
 * @property {string} product_id - UUID of the owning product
 * @property {string} url - Public URL of the image
 * @property {string} [alt_text] - Accessible alt text
 * @property {number} display_order - Ordering index (ascending)
 * @property {boolean} is_primary - Whether this is the primary image
 * @property {string} created_at - ISO timestamp of creation
 */

/**
 * @typedef {Object} Category
 * @property {string} id - UUID of the category
 * @property {string} name - Display name
 * @property {string} slug - URL-friendly slug
 * @property {string|null} parent_id - UUID of parent category, or null for root
 * @property {string} [description] - Optional description
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */

/**
 * @typedef {Object} Brand
 * @property {string} id - UUID of the brand
 * @property {string} name - Display name
 * @property {string} slug - URL-friendly slug
 * @property {string} [description] - Optional description
 * @property {string} [logo_url] - URL to brand logo
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */

/**
 * @typedef {Object} SKU
 * @property {string} id - UUID of the SKU
 * @property {string} product_id - UUID of the owning product
 * @property {string} sku_code - Unique SKU code string
 * @property {number} price - Price in minor currency units (e.g. paise)
 * @property {number} stock_quantity - Available stock count
 * @property {Object.<string, string>} attributes - Key-value variant attributes (e.g. {"color": "red"})
 * @property {boolean} is_active - Whether the SKU is purchasable
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */

/**
 * @typedef {Object} Product
 * @property {string} id - UUID of the product
 * @property {string} name - Display name
 * @property {string} slug - URL-friendly slug
 * @property {string} [description] - Long-form description
 * @property {string} category_id - UUID of the owning category
 * @property {string} brand_id - UUID of the brand
 * @property {boolean} is_active - Whether the product is publicly visible
 * @property {Category} [category] - Hydrated category object
 * @property {Brand} [brand] - Hydrated brand object
 * @property {SKU[]} [skus] - Array of SKUs belonging to this product
 * @property {ProductImage[]} [images] - Array of images
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */

export {};
