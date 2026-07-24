const db = require('../../db');

const VALID_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'return_requested',
  'returned',
  'refunded',
];

const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['out_for_delivery'],
  out_for_delivery: ['delivered'],
  delivered: ['return_requested'],
  return_requested: ['returned', 'confirmed'],
  returned: ['refunded'],
  cancelled: [],
  refunded: [],
};

async function listOrders(userId, isAdmin, filters = {}, pagination = {}) {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;

  let query = db('orders').select(
    'orders.id',
    'orders.user_id',
    'orders.status',
    'orders.total_amount',
    'orders.currency',
    'orders.created_at',
    'orders.updated_at'
  );

  if (!isAdmin) {
    query = query.where('orders.user_id', userId);
  }

  if (filters.status) {
    query = query.where('orders.status', filters.status);
  }

  const countQuery = query.clone().count('orders.id as total').first();
  const [{ total }, rows] = await Promise.all([
    countQuery,
    query.orderBy('orders.created_at', 'desc').limit(limit).offset(offset),
  ]);

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total: parseInt(total, 10),
      totalPages: Math.ceil(parseInt(total, 10) / limit),
    },
  };
}

async function getOrderById(orderId, userId, isAdmin) {
  let query = db('orders')
    .where('orders.id', orderId)
    .select(
      'orders.id',
      'orders.user_id',
      'orders.status',
      'orders.total_amount',
      'orders.currency',
      'orders.shipping_address',
      'orders.billing_address',
      'orders.promo_code',
      'orders.discount_amount',
      'orders.notes',
      'orders.created_at',
      'orders.updated_at'
    )
    .first();

  if (!isAdmin) {
    query = query.where('orders.user_id', userId);
  }

  const order = await query;
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }

  const items = await db('order_items')
    .where('order_id', orderId)
    .select('id', 'sku_id', 'product_name', 'quantity', 'unit_price', 'total_price');

  return { ...order, items };
}

async function getOrderTimeline(orderId, userId, isAdmin) {
  const order = await getOrderById(orderId, userId, isAdmin);

  const timeline = await db('order_status_history')
    .where('order_id', order.id)
    .select('id', 'order_id', 'status', 'note', 'created_by', 'created_at')
    .orderBy('created_at', 'asc');

  return { orderId: order.id, timeline };
}

async function getOrderTracking(orderId, userId, isAdmin) {
  const order = await getOrderById(orderId, userId, isAdmin);

  const tracking = await db('order_tracking')
    .where('order_id', order.id)
    .select('id', 'order_id', 'carrier', 'tracking_number', 'tracking_url', 'status', 'estimated_delivery', 'last_updated')
    .first();

  if (!tracking) {
    const err = new Error('Tracking information not found');
    err.status = 404;
    throw err;
  }

  return tracking;
}

async function getOrderRefunds(orderId, userId, isAdmin) {
  const order = await getOrderById(orderId, userId, isAdmin);

  const refunds = await db('refunds')
    .where('order_id', order.id)
    .select('id', 'order_id', 'amount', 'currency', 'reason', 'status', 'payment_reference', 'created_at', 'updated_at')
    .orderBy('created_at', 'desc');

  return { orderId: order.id, refunds };
}

async function cancelOrder(orderId, userId, isAdmin, reason) {
  const order = await getOrderById(orderId, userId, isAdmin);

  const allowed = STATUS_TRANSITIONS[order.status] || [];
  if (!allowed.includes('cancelled')) {
    const err = new Error(`Order cannot be cancelled from status: ${order.status}`);
    err.status = 422;
    throw err;
  }

  const trx = await db.transaction();
  try {
    await trx('orders').where('id', orderId).update({
      status: 'cancelled',
      updated_at: db.fn.now(),
    });

    await trx('order_status_history').insert({
      order_id: orderId,
      status: 'cancelled',
      note: reason || 'Order cancelled',
      created_by: isAdmin ? 'admin' : `user:${userId}`,
      created_at: db.fn.now(),
    });

    await trx.commit();
  } catch (err) {
    await trx.rollback();
    throw err;
  }

  return { orderId, status: 'cancelled', reason: reason || 'Order cancelled' };
}

async function advanceOrder(orderId, newStatus, options = {}) {
  if (!VALID_STATUSES.includes(newStatus)) {
    const err = new Error(`Invalid status: ${newStatus}`);
    err.status = 422;
    throw err;
  }

  const order = await db('orders').where('id', orderId).first();
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }

  const allowed = STATUS_TRANSITIONS[order.status] || [];
  if (!allowed.includes(newStatus)) {
    const err = new Error(`Cannot transition order from ${order.status} to ${newStatus}`);
    err.status = 422;
    throw err;
  }

  const trx = await db.transaction();
  try {
    await trx('orders').where('id', orderId).update({
      status: newStatus,
      updated_at: db.fn.now(),
    });

    await trx('order_status_history').insert({
      order_id: orderId,
      status: newStatus,
      note: `Status advanced to ${newStatus}`,
      created_by: 'admin',
      created_at: db.fn.now(),
    });

    if (newStatus === 'shipped' && (options.trackingNumber || options.carrier)) {
      const existingTracking = await trx('order_tracking').where('order_id', orderId).first();
      if (existingTracking) {
        await trx('order_tracking').where('order_id', orderId).update({
          carrier: options.carrier || existingTracking.carrier,
          tracking_number: options.trackingNumber || existingTracking.tracking_number,
          status: 'shipped',
          last_updated: db.fn.now(),
        });
      } else {
        await trx('order_tracking').insert({
          order_id: orderId,
          carrier: options.carrier || null,
          tracking_number: options.trackingNumber || null,
          status: 'shipped',
          last_updated: db.fn.now(),
        });
      }
    }

    await trx.commit();
  } catch (err) {
    await trx.rollback();
    throw err;
  }

  return { orderId, status: newStatus };
}

async function createOrderFromCheckout(orderData, trx) {
  const client = trx || db;

  const [orderId] = await client('orders').insert({
    user_id: orderData.userId,
    status: 'pending',
    total_amount: orderData.totalAmount,
    currency: orderData.currency || 'USD',
    shipping_address: JSON.stringify(orderData.shippingAddress),
    billing_address: JSON.stringify(orderData.billingAddress),
    promo_code: orderData.promoCode || null,
    discount_amount: orderData.discountAmount || 0,
    notes: orderData.notes || null,
    created_at: db.fn.now(),
    updated_at: db.fn.now(),
  });

  if (orderData.items && orderData.items.length > 0) {
    const orderItems = orderData.items.map((item) => ({
      order_id: orderId,
      sku_id: item.skuId,
      product_name: item.productName,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
    }));
    await client('order_items').insert(orderItems);
  }

  await client('order_status_history').insert({
    order_id: orderId,
    status: 'pending',
    note: 'Order placed',
    created_by: `user:${orderData.userId}`,
    created_at: db.fn.now(),
  });

  return orderId;
}

async function createReturnRequest(orderId, userId, payload = {}) {
  const order = await getOrderById(orderId, userId, false);

  if (order.status !== 'delivered') {
    const err = new Error('Return requests can only be created for delivered orders');
    err.status = 422;
    throw err;
  }

  const existingReturn = await db('return_requests')
    .where('order_id', orderId)
    .whereNotIn('status', ['rejected', 'cancelled'])
    .first();

  if (existingReturn) {
    const err = new Error('A return request already exists for this order');
    err.status = 409;
    throw err;
  }

  const trx = await db.transaction();
  try {
    const [returnRequestId] = await trx('return_requests').insert({
      order_id: orderId,
      user_id: userId,
      reason: payload.reason || null,
      status: 'pending',
      items: payload.items ? JSON.stringify(payload.items) : null,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    });

    await trx('orders').where('id', orderId).update({
      status: 'return_requested',
      updated_at: db.fn.now(),
    });

    await trx('order_status_history').insert({
      order_id: orderId,
      status: 'return_requested',
      note: `Return request created: ${payload.reason || 'No reason provided'}`,
      created_by: `user:${userId}`,
      created_at: db.fn.now(),
    });

    await trx.commit();
    return { returnRequestId, orderId, status: 'pending' };
  } catch (err) {
    await trx.rollback();
    throw err;
  }
}

module.exports = {
  listOrders,
  getOrderById,
  getOrderTimeline,
  getOrderTracking,
  getOrderRefunds,
  cancelOrder,
  advanceOrder,
  createOrderFromCheckout,
  createReturnRequest,
};
