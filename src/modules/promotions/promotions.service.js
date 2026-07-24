const db = require('../../config/db');
const { AppError } = require('../../utils/AppError');

/**
 * Retrieve a promo code record by its code string.
 */
const findPromoCodeByCode = async (code) => {
  const [rows] = await db.query(
    'SELECT * FROM promo_codes WHERE code = ? AND is_active = 1 LIMIT 1',
    [code]
  );
  return rows[0] || null;
};

/**
 * Retrieve a promo code record by its primary key.
 */
const getPromoCodeById = async (promoCodeId) => {
  const [rows] = await db.query('SELECT * FROM promo_codes WHERE id = ? LIMIT 1', [promoCodeId]);
  if (!rows[0]) {
    throw new AppError('Promo code not found.', 404);
  }
  return rows[0];
};

/**
 * Validate promo code eligibility rules and calculate discount.
 */
const applyPromoCode = async ({ cartId, code, userId }) => {
  // Fetch the cart
  const [cartRows] = await db.query('SELECT * FROM carts WHERE id = ? LIMIT 1', [cartId]);
  const cart = cartRows[0];
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }

  // Ensure the cart belongs to the requesting user
  if (String(cart.user_id) !== String(userId) && cart.guest_token === null) {
    throw new AppError('Access denied to this cart.', 403);
  }

  // Fetch the promo code
  const promo = await findPromoCodeByCode(code);
  if (!promo) {
    throw new AppError('Invalid or expired promo code.', 400);
  }

  const now = new Date();

  // Check validity window
  if (promo.valid_from && new Date(promo.valid_from) > now) {
    throw new AppError('This promo code is not yet active.', 400);
  }
  if (promo.valid_until && new Date(promo.valid_until) < now) {
    throw new AppError('This promo code has expired.', 400);
  }

  // Check global usage limit
  if (promo.usage_limit !== null && promo.usage_count >= promo.usage_limit) {
    throw new AppError('This promo code has reached its usage limit.', 400);
  }

  // Check per-user usage limit
  if (promo.per_user_limit !== null) {
    const [usageRows] = await db.query(
      'SELECT COUNT(*) AS cnt FROM promo_code_usages WHERE promo_code_id = ? AND user_id = ?',
      [promo.id, userId]
    );
    if (usageRows[0].cnt >= promo.per_user_limit) {
      throw new AppError('You have already used this promo code the maximum number of times.', 400);
    }
  }

  // Fetch cart items to compute subtotal
  const [itemRows] = await db.query(
    'SELECT ci.*, s.price FROM cart_items ci JOIN skus s ON ci.sku_id = s.id WHERE ci.cart_id = ?',
    [cartId]
  );

  const subtotal = itemRows.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Check minimum order value
  if (promo.min_order_value !== null && subtotal < promo.min_order_value) {
    throw new AppError(
      `A minimum order value of ${promo.min_order_value} is required to use this promo code.`,
      400
    );
  }

  // Calculate discount
  const discountAmount = calculateDiscount(promo, subtotal);

  // Persist promo code on cart
  await db.query(
    'UPDATE carts SET promo_code_id = ?, discount_amount = ? WHERE id = ?',
    [promo.id, discountAmount, cartId]
  );

  return {
    promoCodeId: promo.id,
    code: promo.code,
    discountType: promo.discount_type,
    discountValue: promo.discount_value,
    discountAmount,
    subtotal,
    total: Math.max(0, subtotal - discountAmount),
  };
};

/**
 * Calculate the discount amount based on the promo type.
 */
const calculateDiscount = (promo, subtotal) => {
  let discountAmount = 0;

  if (promo.discount_type === 'percentage') {
    discountAmount = (subtotal * promo.discount_value) / 100;
    if (promo.max_discount_value !== null) {
      discountAmount = Math.min(discountAmount, promo.max_discount_value);
    }
  } else if (promo.discount_type === 'flat') {
    discountAmount = promo.discount_value;
  } else if (promo.discount_type === 'free_shipping') {
    discountAmount = 0; // shipping discount handled at checkout
  }

  return Math.min(discountAmount, subtotal);
};

/**
 * List all promo codes with optional filters.
 */
const listPromoCodes = async (filters = {}) => {
  let query = 'SELECT * FROM promo_codes WHERE 1=1';
  const params = [];

  if (filters.is_active !== undefined) {
    query += ' AND is_active = ?';
    params.push(filters.is_active === 'true' || filters.is_active === true ? 1 : 0);
  }

  if (filters.discount_type) {
    query += ' AND discount_type = ?';
    params.push(filters.discount_type);
  }

  query += ' ORDER BY created_at DESC';

  const [rows] = await db.query(query, params);
  return rows;
};

/**
 * Create a new promo code.
 */
const createPromoCode = async (payload) => {
  const {
    code,
    discount_type,
    discount_value,
    max_discount_value = null,
    min_order_value = null,
    usage_limit = null,
    per_user_limit = null,
    valid_from = null,
    valid_until = null,
    is_active = true,
    description = null,
  } = payload;

  // Check for duplicate code
  const [existing] = await db.query('SELECT id FROM promo_codes WHERE code = ? LIMIT 1', [code]);
  if (existing.length > 0) {
    throw new AppError('A promo code with this code already exists.', 409);
  }

  const [result] = await db.query(
    `INSERT INTO promo_codes
      (code, discount_type, discount_value, max_discount_value, min_order_value,
       usage_limit, per_user_limit, valid_from, valid_until, is_active, description, usage_count)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      code,
      discount_type,
      discount_value,
      max_discount_value,
      min_order_value,
      usage_limit,
      per_user_limit,
      valid_from,
      valid_until,
      is_active ? 1 : 0,
      description,
    ]
  );

  return getPromoCodeById(result.insertId);
};

/**
 * Update an existing promo code.
 */
const updatePromoCode = async (promoCodeId, payload) => {
  const promo = await getPromoCodeById(promoCodeId);

  const {
    code = promo.code,
    discount_type = promo.discount_type,
    discount_value = promo.discount_value,
    max_discount_value = promo.max_discount_value,
    min_order_value = promo.min_order_value,
    usage_limit = promo.usage_limit,
    per_user_limit = promo.per_user_limit,
    valid_from = promo.valid_from,
    valid_until = promo.valid_until,
    is_active = promo.is_active,
    description = promo.description,
  } = payload;

  // Check for duplicate code conflict with another record
  if (code !== promo.code) {
    const [existing] = await db.query(
      'SELECT id FROM promo_codes WHERE code = ? AND id != ? LIMIT 1',
      [code, promoCodeId]
    );
    if (existing.length > 0) {
      throw new AppError('A promo code with this code already exists.', 409);
    }
  }

  await db.query(
    `UPDATE promo_codes SET
      code = ?, discount_type = ?, discount_value = ?, max_discount_value = ?,
      min_order_value = ?, usage_limit = ?, per_user_limit = ?, valid_from = ?,
      valid_until = ?, is_active = ?, description = ?
     WHERE id = ?`,
    [
      code,
      discount_type,
      discount_value,
      max_discount_value,
      min_order_value,
      usage_limit,
      per_user_limit,
      valid_from,
      valid_until,
      is_active ? 1 : 0,
      description,
      promoCodeId,
    ]
  );

  return getPromoCodeById(promoCodeId);
};

/**
 * Soft-delete (deactivate) a promo code.
 */
const deletePromoCode = async (promoCodeId) => {
  await getPromoCodeById(promoCodeId);
  await db.query('UPDATE promo_codes SET is_active = 0 WHERE id = ?', [promoCodeId]);
};

/**
 * Increment usage count after a successful order.
 */
const recordPromoUsage = async ({ promoCodeId, userId, orderId }) => {
  await db.query(
    'UPDATE promo_codes SET usage_count = usage_count + 1 WHERE id = ?',
    [promoCodeId]
  );
  await db.query(
    'INSERT INTO promo_code_usages (promo_code_id, user_id, order_id) VALUES (?, ?, ?)',
    [promoCodeId, userId, orderId]
  );
};

module.exports = {
  applyPromoCode,
  listPromoCodes,
  createPromoCode,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode,
  recordPromoUsage,
  calculateDiscount,
  findPromoCodeByCode,
};
