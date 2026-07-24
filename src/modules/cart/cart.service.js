const { v4: uuidv4 } = require('uuid');
const db = require('../../config/db');
const AppError = require('../../utils/AppError');

/**
 * Fetch a full cart with items by cartId.
 * Optionally validates ownership by userId (if provided).
 */
const fetchCartById = async (cartId, userId = null) => {
  const cartResult = await db.query(
    `SELECT c.id, c.user_id, c.guest_id, c.promo_code_id, c.status, c.created_at, c.updated_at,
            pc.code AS promo_code, pc.discount_type, pc.discount_value
     FROM carts c
     LEFT JOIN promo_codes pc ON pc.id = c.promo_code_id
     WHERE c.id = $1`,
    [cartId]
  );

  if (cartResult.rows.length === 0) {
    throw new AppError('Cart not found.', 404);
  }

  const cart = cartResult.rows[0];

  if (userId && cart.user_id && cart.user_id !== userId) {
    throw new AppError('Access denied to this cart.', 403);
  }

  const itemsResult = await db.query(
    `SELECT ci.id, ci.cart_id, ci.sku_id, ci.quantity,
            s.price, s.sale_price, s.stock,
            p.name AS product_name, p.slug AS product_slug,
            s.attributes
     FROM cart_items ci
     JOIN skus s ON s.id = ci.sku_id
     JOIN products p ON p.id = s.product_id
     WHERE ci.cart_id = $1`,
    [cartId]
  );

  cart.items = itemsResult.rows;
  cart.subtotal = cart.items.reduce((sum, item) => {
    const price = item.sale_price !== null ? item.sale_price : item.price;
    return sum + price * item.quantity;
  }, 0);

  cart.discount = 0;
  if (cart.promo_code) {
    if (cart.discount_type === 'percentage') {
      cart.discount = (cart.subtotal * cart.discount_value) / 100;
    } else if (cart.discount_type === 'fixed') {
      cart.discount = cart.discount_value;
    }
    cart.discount = Math.min(cart.discount, cart.subtotal);
  }

  cart.total = Math.max(0, cart.subtotal - cart.discount);

  return cart;
};

/**
 * Create a new cart (guest or authenticated).
 * If authenticated user has a prior guest cart, merge it.
 */
const createCart = async ({ userId, guestId }) => {
  // If authenticated user, check for existing active cart
  if (userId) {
    const existing = await db.query(
      `SELECT id FROM carts WHERE user_id = $1 AND status = 'active' LIMIT 1`,
      [userId]
    );
    if (existing.rows.length > 0) {
      return fetchCartById(existing.rows[0].id, userId);
    }
  }

  // If guestId provided and user is authenticated, merge guest cart
  if (userId && guestId) {
    return mergeGuestCart({ userId, guestId });
  }

  const newId = uuidv4();
  const result = await db.query(
    `INSERT INTO carts (id, user_id, guest_id, status, created_at, updated_at)
     VALUES ($1, $2, $3, 'active', NOW(), NOW())
     RETURNING id`,
    [newId, userId || null, guestId || null]
  );

  return fetchCartById(result.rows[0].id);
};

/**
 * Get a cart by cartId.
 */
const getCart = async ({ cartId, userId }) => {
  return fetchCartById(cartId, userId);
};

/**
 * Add an item to a cart; if sku already exists, increment quantity.
 * Validates stock availability.
 */
const addItem = async ({ cartId, userId, skuId, quantity }) => {
  await fetchCartById(cartId, userId);

  // Validate SKU exists and has sufficient stock
  const skuResult = await db.query(
    `SELECT id, stock FROM skus WHERE id = $1`,
    [skuId]
  );

  if (skuResult.rows.length === 0) {
    throw new AppError('SKU not found.', 404);
  }

  const sku = skuResult.rows[0];

  // Check if item already in cart
  const existingItem = await db.query(
    `SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND sku_id = $2`,
    [cartId, skuId]
  );

  let newQuantity = quantity;
  if (existingItem.rows.length > 0) {
    newQuantity = existingItem.rows[0].quantity + quantity;
  }

  if (sku.stock < newQuantity) {
    throw new AppError('Insufficient stock for the requested quantity.', 422);
  }

  if (existingItem.rows.length > 0) {
    await db.query(
      `UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2`,
      [newQuantity, existingItem.rows[0].id]
    );
  } else {
    const itemId = uuidv4();
    await db.query(
      `INSERT INTO cart_items (id, cart_id, sku_id, quantity, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [itemId, cartId, skuId, quantity]
    );
  }

  await db.query(`UPDATE carts SET updated_at = NOW() WHERE id = $1`, [cartId]);

  return fetchCartById(cartId, userId);
};

/**
 * Update quantity of a cart item.
 * Validates stock availability.
 */
const updateItem = async ({ cartId, itemId, userId, quantity }) => {
  await fetchCartById(cartId, userId);

  const itemResult = await db.query(
    `SELECT ci.id, ci.sku_id, s.stock
     FROM cart_items ci
     JOIN skus s ON s.id = ci.sku_id
     WHERE ci.id = $1 AND ci.cart_id = $2`,
    [itemId, cartId]
  );

  if (itemResult.rows.length === 0) {
    throw new AppError('Cart item not found.', 404);
  }

  const item = itemResult.rows[0];

  if (item.stock < quantity) {
    throw new AppError('Insufficient stock for the requested quantity.', 422);
  }

  await db.query(
    `UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2`,
    [quantity, itemId]
  );

  await db.query(`UPDATE carts SET updated_at = NOW() WHERE id = $1`, [cartId]);

  return fetchCartById(cartId, userId);
};

/**
 * Remove an item from a cart.
 */
const removeItem = async ({ cartId, itemId, userId }) => {
  await fetchCartById(cartId, userId);

  const itemResult = await db.query(
    `SELECT id FROM cart_items WHERE id = $1 AND cart_id = $2`,
    [itemId, cartId]
  );

  if (itemResult.rows.length === 0) {
    throw new AppError('Cart item not found.', 404);
  }

  await db.query(`DELETE FROM cart_items WHERE id = $1`, [itemId]);
  await db.query(`UPDATE carts SET updated_at = NOW() WHERE id = $1`, [cartId]);

  return fetchCartById(cartId, userId);
};

/**
 * Apply a promo code to a cart.
 * Validates promo code existence, validity period, and usage limits.
 */
const applyPromo = async ({ cartId, userId, promoCode }) => {
  const cart = await fetchCartById(cartId, userId);

  const promoResult = await db.query(
    `SELECT id, code, discount_type, discount_value, min_order_value,
            max_uses, uses_count, valid_from, valid_until, is_active
     FROM promo_codes
     WHERE code = $1`,
    [promoCode]
  );

  if (promoResult.rows.length === 0) {
    throw new AppError('Promo code not found.', 404);
  }

  const promo = promoResult.rows[0];

  if (!promo.is_active) {
    throw new AppError('Promo code is not active.', 422);
  }

  const now = new Date();
  if (promo.valid_from && new Date(promo.valid_from) > now) {
    throw new AppError('Promo code is not yet valid.', 422);
  }

  if (promo.valid_until && new Date(promo.valid_until) < now) {
    throw new AppError('Promo code has expired.', 422);
  }

  if (promo.max_uses !== null && promo.uses_count >= promo.max_uses) {
    throw new AppError('Promo code usage limit has been reached.', 422);
  }

  if (promo.min_order_value !== null && cart.subtotal < promo.min_order_value) {
    throw new AppError(
      `Minimum order value of ${promo.min_order_value} is required to use this promo code.`,
      422
    );
  }

  await db.query(
    `UPDATE carts SET promo_code_id = $1, updated_at = NOW() WHERE id = $2`,
    [promo.id, cartId]
  );

  return fetchCartById(cartId, userId);
};

/**
 * Remove the applied promo code from a cart.
 */
const removePromo = async ({ cartId, userId }) => {
  await fetchCartById(cartId, userId);

  await db.query(
    `UPDATE carts SET promo_code_id = NULL, updated_at = NOW() WHERE id = $1`,
    [cartId]
  );

  return fetchCartById(cartId, userId);
};

/**
 * Merge guest cart items into an authenticated user's cart.
 * Called during login / cart creation for authenticated users with a prior guest session.
 */
const mergeGuestCart = async ({ userId, guestId }) => {
  const guestCartResult = await db.query(
    `SELECT id FROM carts WHERE guest_id = $1 AND status = 'active' LIMIT 1`,
    [guestId]
  );

  if (guestCartResult.rows.length === 0) {
    return createCart({ userId, guestId: null });
  }

  const guestCartId = guestCartResult.rows[0].id;

  // Find or create user cart
  let userCartId;
  const userCartResult = await db.query(
    `SELECT id FROM carts WHERE user_id = $1 AND status = 'active' LIMIT 1`,
    [userId]
  );

  if (userCartResult.rows.length > 0) {
    userCartId = userCartResult.rows[0].id;
  } else {
    const newId = uuidv4();
    await db.query(
      `INSERT INTO carts (id, user_id, guest_id, status, created_at, updated_at)
       VALUES ($1, $2, NULL, 'active', NOW(), NOW())`,
      [newId, userId]
    );
    userCartId = newId;
  }

  // Fetch guest cart items
  const guestItems = await db.query(
    `SELECT sku_id, quantity FROM cart_items WHERE cart_id = $1`,
    [guestCartId]
  );

  for (const guestItem of guestItems.rows) {
    const skuResult = await db.query(
      `SELECT stock FROM skus WHERE id = $1`,
      [guestItem.sku_id]
    );

    if (skuResult.rows.length === 0) continue;
    const stock = skuResult.rows[0].stock;

    const existingItem = await db.query(
      `SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND sku_id = $2`,
      [userCartId, guestItem.sku_id]
    );

    if (existingItem.rows.length > 0) {
      const mergedQuantity = Math.min(
        existingItem.rows[0].quantity + guestItem.quantity,
        stock
      );
      await db.query(
        `UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2`,
        [mergedQuantity, existingItem.rows[0].id]
      );
    } else {
      const safeQuantity = Math.min(guestItem.quantity, stock);
      if (safeQuantity > 0) {
        const itemId = uuidv4();
        await db.query(
          `INSERT INTO cart_items (id, cart_id, sku_id, quantity, created_at, updated_at)
           VALUES ($1, $2, $3, $4, NOW(), NOW())`,
          [itemId, userCartId, guestItem.sku_id, safeQuantity]
        );
      }
    }
  }

  // Mark guest cart as merged
  await db.query(
    `UPDATE carts SET status = 'merged', updated_at = NOW() WHERE id = $1`,
    [guestCartId]
  );

  await db.query(`UPDATE carts SET updated_at = NOW() WHERE id = $1`, [userCartId]);

  return fetchCartById(userCartId, userId);
};

module.exports = {
  createCart,
  getCart,
  addItem,
  updateItem,
  removeItem,
  applyPromo,
  removePromo,
  mergeGuestCart,
};
