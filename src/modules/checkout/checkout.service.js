const db = require('../../db');
const { AppError } = require('../../utils/errors');
const cartService = require('../cart/cart.service');
const addressesService = require('../addresses/addresses.service');
const promotionsService = require('../promotions/promotions.service');

/**
 * Starts a checkout session.
 * Validates that the cart exists, belongs to the requester,
 * and that all items are in stock at the quantities requested.
 *
 * @param {object} params
 * @param {string} params.cartId
 * @param {string|null} params.guestToken
 * @param {string|null} params.userId
 * @returns {object} checkout session data
 */
async function startCheckout({ cartId, guestToken, userId }) {
  const cart = await cartService.getCart({ cartId, userId, guestToken });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new AppError('Cart is empty or not found.', 400);
  }

  // Verify stock for all cart items
  await _confirmStockReservation(cart.items);

  // Create or upsert a checkout session record
  const existingSession = await db.query(
    `SELECT id FROM checkout_sessions WHERE cart_id = $1 AND status = 'pending' LIMIT 1`,
    [cartId]
  );

  let checkoutSessionId;
  if (existingSession.rows.length > 0) {
    checkoutSessionId = existingSession.rows[0].id;
    await db.query(
      `UPDATE checkout_sessions SET updated_at = NOW() WHERE id = $1`,
      [checkoutSessionId]
    );
  } else {
    const result = await db.query(
      `INSERT INTO checkout_sessions (cart_id, user_id, guest_token, status, created_at, updated_at)
       VALUES ($1, $2, $3, 'pending', NOW(), NOW()) RETURNING id`,
      [cartId, userId || null, guestToken || null]
    );
    checkoutSessionId = result.rows[0].id;
  }

  return {
    checkoutSessionId,
    cart,
    stockConfirmed: true,
  };
}

/**
 * Validates the delivery address and attaches it to the checkout session.
 *
 * @param {object} params
 * @param {string} params.checkoutSessionId
 * @param {object|null} params.address  — inline address object
 * @param {string|null} params.addressId — saved address ID
 * @param {string|null} params.userId
 * @returns {object} updated session data
 */
async function submitAddress({ checkoutSessionId, address, addressId, userId }) {
  const session = await _getSession(checkoutSessionId);

  let resolvedAddress;

  if (addressId) {
    // Fetch saved address
    resolvedAddress = await addressesService.getAddressById({ addressId, userId });
    if (!resolvedAddress) {
      throw new AppError('Address not found.', 404);
    }
  } else if (address) {
    resolvedAddress = _validateAddressObject(address);
  } else {
    throw new AppError('Either addressId or an address object must be provided.', 400);
  }

  // Persist address on session
  await db.query(
    `UPDATE checkout_sessions
     SET delivery_address = $1, updated_at = NOW()
     WHERE id = $2`,
    [JSON.stringify(resolvedAddress), checkoutSessionId]
  );

  return { checkoutSessionId, deliveryAddress: resolvedAddress };
}

/**
 * Returns a full order summary for the active checkout session.
 *
 * @param {object} params
 * @param {string} params.checkoutSessionId
 * @param {string|null} params.userId
 * @returns {object} summary
 */
async function reviewCheckout({ checkoutSessionId, userId }) {
  const session = await _getSession(checkoutSessionId);

  const cart = await cartService.getCart({
    cartId: session.cart_id,
    userId: userId || null,
    guestToken: session.guest_token,
  });

  const deliveryAddress = session.delivery_address
    ? (typeof session.delivery_address === 'string'
        ? JSON.parse(session.delivery_address)
        : session.delivery_address)
    : null;

  const promoSummary = cart.promo || null;

  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = promoSummary ? (promoSummary.discountAmount || 0) : 0;
  const total = Math.max(0, subtotal - discount);

  return {
    checkoutSessionId,
    items: cart.items,
    deliveryAddress,
    promo: promoSummary,
    subtotal,
    discount,
    total,
  };
}

/**
 * Places the order:
 *  1. Re-confirms stock reservation
 *  2. Finalises promo code usage
 *  3. Creates order record
 *  4. Delegates payment intent creation
 *  5. Marks checkout session as completed
 *
 * @param {object} params
 * @param {string} params.checkoutSessionId
 * @param {object} params.paymentMethod
 * @param {string|null} params.guestToken
 * @param {string|null} params.userId
 * @returns {object} order and payment intent
 */
async function placeOrder({ checkoutSessionId, paymentMethod, guestToken, userId }) {
  const session = await _getSession(checkoutSessionId);

  if (!session.delivery_address) {
    throw new AppError('Delivery address is required before placing an order.', 400);
  }

  const cart = await cartService.getCart({
    cartId: session.cart_id,
    userId: userId || null,
    guestToken: session.guest_token || guestToken,
  });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new AppError('Cart is empty or not found.', 400);
  }

  // 1. Re-confirm stock reservation
  await _confirmStockReservation(cart.items);

  // 2. Finalise promo
  const promoSummary = cart.promo || null;
  if (promoSummary && promoSummary.code) {
    await promotionsService.finalisePromoUsage({ code: promoSummary.code, userId });
  }

  const deliveryAddress = typeof session.delivery_address === 'string'
    ? JSON.parse(session.delivery_address)
    : session.delivery_address;

  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = promoSummary ? (promoSummary.discountAmount || 0) : 0;
  const total = Math.max(0, subtotal - discount);

  // 3. Create order
  const orderResult = await db.query(
    `INSERT INTO orders
       (user_id, guest_token, cart_id, status, delivery_address, promo_code, subtotal, discount, total, payment_method, created_at, updated_at)
     VALUES ($1, $2, $3, 'pending_payment', $4, $5, $6, $7, $8, $9, NOW(), NOW())
     RETURNING id`,
    [
      userId || null,
      session.guest_token || guestToken || null,
      session.cart_id,
      JSON.stringify(deliveryAddress),
      promoSummary ? promoSummary.code : null,
      subtotal,
      discount,
      total,
      JSON.stringify(paymentMethod),
    ]
  );

  const orderId = orderResult.rows[0].id;

  // Insert order items
  for (const item of cart.items) {
    await db.query(
      `INSERT INTO order_items (order_id, sku_id, product_name, quantity, unit_price, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [orderId, item.skuId, item.productName, item.quantity, item.price]
    );
  }

  // Decrement stock
  for (const item of cart.items) {
    await db.query(
      `UPDATE skus SET stock_quantity = stock_quantity - $1 WHERE id = $2`,
      [item.quantity, item.skuId]
    );
  }

  // 4. Delegate payment intent
  const paymentIntent = await _initiatePaymentIntent({ orderId, total, paymentMethod, userId });

  // 5. Mark session completed
  await db.query(
    `UPDATE checkout_sessions SET status = 'completed', updated_at = NOW() WHERE id = $1`,
    [checkoutSessionId]
  );

  return {
    orderId,
    status: 'pending_payment',
    total,
    paymentIntent,
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function _getSession(checkoutSessionId) {
  if (!checkoutSessionId) {
    throw new AppError('checkoutSessionId is required.', 400);
  }
  const result = await db.query(
    `SELECT * FROM checkout_sessions WHERE id = $1 LIMIT 1`,
    [checkoutSessionId]
  );
  if (result.rows.length === 0) {
    throw new AppError('Checkout session not found.', 404);
  }
  const session = result.rows[0];
  if (session.status === 'completed') {
    throw new AppError('Checkout session has already been completed.', 400);
  }
  return session;
}

async function _confirmStockReservation(items) {
  for (const item of items) {
    const result = await db.query(
      `SELECT stock_quantity FROM skus WHERE id = $1 LIMIT 1`,
      [item.skuId]
    );
    if (result.rows.length === 0) {
      throw new AppError(`Product SKU ${item.skuId} not found.`, 400);
    }
    if (result.rows[0].stock_quantity < item.quantity) {
      throw new AppError(
        `Insufficient stock for SKU ${item.skuId}. Requested: ${item.quantity}, available: ${result.rows[0].stock_quantity}.`,
        409
      );
    }
  }
}

function _validateAddressObject(address) {
  const required = ['fullName', 'line1', 'city', 'state', 'postalCode', 'country', 'phone'];
  for (const field of required) {
    if (!address[field] || String(address[field]).trim() === '') {
      throw new AppError(`Address field '${field}' is required.`, 400);
    }
  }
  return address;
}

async function _initiatePaymentIntent({ orderId, total, paymentMethod, userId }) {
  // Delegate to the payments module / external gateway
  // This is a stub — in production this would call the payments service
  return {
    paymentIntentId: `pi_${orderId}`,
    amount: total,
    currency: 'INR',
    paymentMethod,
    status: 'created',
  };
}

module.exports = { startCheckout, submitAddress, reviewCheckout, placeOrder };
