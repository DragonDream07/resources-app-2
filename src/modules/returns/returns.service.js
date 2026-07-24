const db = require('../../config/db');

const RETURNABLE_STATUSES = ['delivered'];
const RETURN_WINDOW_DAYS = 7;

/**
 * Check whether an order is eligible for a return.
 * @param {string} orderId
 * @param {string} userId
 * @returns {Promise<object>} order row
 */
async function checkReturnEligibility(orderId, userId) {
  const { rows } = await db.query(
    `SELECT * FROM orders WHERE id = $1 AND user_id = $2 LIMIT 1`,
    [orderId, userId]
  );
  const order = rows[0];
  if (!order) {
    const err = new Error('Order not found.');
    err.status = 404;
    throw err;
  }
  if (!RETURNABLE_STATUSES.includes(order.status)) {
    const err = new Error('Order is not eligible for return. Only delivered orders can be returned.');
    err.status = 422;
    throw err;
  }
  const deliveredAt = order.delivered_at ? new Date(order.delivered_at) : null;
  if (deliveredAt) {
    const windowEnd = new Date(deliveredAt);
    windowEnd.setDate(windowEnd.getDate() + RETURN_WINDOW_DAYS);
    if (new Date() > windowEnd) {
      const err = new Error(`Return window of ${RETURN_WINDOW_DAYS} days has expired.`);
      err.status = 422;
      throw err;
    }
  }
  return order;
}

/**
 * Create a return request for an order.
 * @param {string} orderId
 * @param {string} userId
 * @param {object} payload - { reason, items }
 * @returns {Promise<object>}
 */
async function createReturnRequest(orderId, userId, payload) {
  await checkReturnEligibility(orderId, userId);

  // Check for existing pending/open return request
  const { rows: existing } = await db.query(
    `SELECT id FROM return_requests WHERE order_id = $1 AND status IN ('pending', 'under_review') LIMIT 1`,
    [orderId]
  );
  if (existing.length > 0) {
    const err = new Error('A return request for this order is already in progress.');
    err.status = 409;
    throw err;
  }

  const { reason, items } = payload;
  const { rows } = await db.query(
    `INSERT INTO return_requests (order_id, user_id, reason, items, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, 'pending', NOW(), NOW())
     RETURNING *`,
    [orderId, userId, reason, JSON.stringify(items || [])]
  );
  return rows[0];
}

/**
 * List all return requests with optional filters.
 * @param {object} filters - { status, orderId, userId, page, limit }
 * @returns {Promise<{ data: object[], total: number, page: number, limit: number }>}
 */
async function listReturnRequests(filters) {
  const { status, orderId, userId, page = 1, limit = 20 } = filters;
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];

  if (status) {
    params.push(status);
    conditions.push(`rr.status = $${params.length}`);
  }
  if (orderId) {
    params.push(orderId);
    conditions.push(`rr.order_id = $${params.length}`);
  }
  if (userId) {
    params.push(userId);
    conditions.push(`rr.user_id = $${params.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countParams = [...params];
  const { rows: countRows } = await db.query(
    `SELECT COUNT(*) AS total FROM return_requests rr ${where}`,
    countParams
  );
  const total = parseInt(countRows[0].total, 10);

  params.push(limit);
  params.push(offset);
  const { rows } = await db.query(
    `SELECT rr.* FROM return_requests rr ${where}
     ORDER BY rr.created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return { data: rows, total, page, limit };
}

/**
 * Get a return request by its ID.
 * @param {string} returnRequestId
 * @returns {Promise<object|null>}
 */
async function getReturnRequestById(returnRequestId) {
  const { rows } = await db.query(
    `SELECT * FROM return_requests WHERE id = $1 LIMIT 1`,
    [returnRequestId]
  );
  return rows[0] || null;
}

/**
 * Admin reviews a return request: approve or reject.
 * On approval: trigger refund and update stock.
 * @param {string} returnRequestId
 * @param {string} adminId
 * @param {object} payload - { decision, notes }
 * @returns {Promise<object>}
 */
async function reviewReturnRequest(returnRequestId, adminId, payload) {
  const returnRequest = await getReturnRequestById(returnRequestId);
  if (!returnRequest) {
    const err = new Error('Return request not found.');
    err.status = 404;
    throw err;
  }
  if (returnRequest.status !== 'pending' && returnRequest.status !== 'under_review') {
    const err = new Error('Return request has already been reviewed.');
    err.status = 422;
    throw err;
  }

  const { decision, notes } = payload;
  const newStatus = decision === 'approved' ? 'approved' : 'rejected';

  const { rows } = await db.query(
    `UPDATE return_requests
     SET status = $1, reviewed_by = $2, review_notes = $3, reviewed_at = NOW(), updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [newStatus, adminId, notes || null, returnRequestId]
  );
  const updated = rows[0];

  if (newStatus === 'approved') {
    await triggerRefund(updated);
    await updateStockOnApproval(updated);
  }

  return updated;
}

/**
 * Trigger refund for an approved return request.
 * @param {object} returnRequest
 */
async function triggerRefund(returnRequest) {
  // Insert a refund record linked to the return request and order.
  await db.query(
    `INSERT INTO refunds (order_id, return_request_id, status, created_at, updated_at)
     VALUES ($1, $2, 'pending', NOW(), NOW())
     ON CONFLICT DO NOTHING`,
    [returnRequest.order_id, returnRequest.id]
  );
}

/**
 * Update stock when a return is approved.
 * Re-stocks items listed in the return request.
 * @param {object} returnRequest
 */
async function updateStockOnApproval(returnRequest) {
  let items = returnRequest.items;
  if (typeof items === 'string') {
    try {
      items = JSON.parse(items);
    } catch {
      items = [];
    }
  }
  if (!Array.isArray(items) || items.length === 0) return;

  for (const item of items) {
    const { sku_id, quantity } = item;
    if (!sku_id || !quantity) continue;
    await db.query(
      `UPDATE skus SET stock_quantity = stock_quantity + $1, updated_at = NOW() WHERE id = $2`,
      [quantity, sku_id]
    );
  }
}

module.exports = {
  checkReturnEligibility,
  createReturnRequest,
  listReturnRequests,
  getReturnRequestById,
  reviewReturnRequest,
  triggerRefund,
  updateStockOnApproval,
};
