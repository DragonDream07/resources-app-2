const db = require('../client');

const ORDERS_TABLE = 'orders';
const ITEMS_TABLE = 'order_items';
const HISTORY_TABLE = 'order_status_history';
const TRACKING_TABLE = 'order_tracking';

async function findById(id) {
  return db(ORDERS_TABLE).where({ id }).first();
}

async function findByOrderNumber(orderNumber) {
  return db(ORDERS_TABLE).where({ order_number: orderNumber }).first();
}

async function findByUserId(userId, { limit = 20, offset = 0 } = {}) {
  return db(ORDERS_TABLE)
    .where({ user_id: userId })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);
}

async function countByUserId(userId) {
  const [{ total }] = await db(ORDERS_TABLE).where({ user_id: userId }).count('id as total');
  return Number(total);
}

async function findAll({ limit = 20, offset = 0, status } = {}) {
  const query = db(ORDERS_TABLE).orderBy('created_at', 'desc').limit(limit).offset(offset);
  if (status) {
    query.where({ status });
  }
  return query;
}

async function count({ status } = {}) {
  const query = db(ORDERS_TABLE).count('id as total');
  if (status) {
    query.where({ status });
  }
  const [{ total }] = await query;
  return Number(total);
}

async function create(data) {
  const [id] = await db(ORDERS_TABLE).insert(data);
  return findById(id);
}

async function update(id, data) {
  await db(ORDERS_TABLE).where({ id }).update(data);
  return findById(id);
}

async function findItemsByOrderId(orderId) {
  return db(ITEMS_TABLE).where({ order_id: orderId });
}

async function findItemById(id) {
  return db(ITEMS_TABLE).where({ id }).first();
}

async function createItem(data) {
  const [id] = await db(ITEMS_TABLE).insert(data);
  return findItemById(id);
}

async function addStatusHistory(data) {
  const [id] = await db(HISTORY_TABLE).insert(data);
  return db(HISTORY_TABLE).where({ id }).first();
}

async function findStatusHistory(orderId) {
  return db(HISTORY_TABLE).where({ order_id: orderId }).orderBy('created_at', 'asc');
}

async function findTracking(orderId) {
  return db(TRACKING_TABLE).where({ order_id: orderId }).orderBy('updated_at', 'desc').first();
}

async function upsertTracking(orderId, data) {
  const existing = await db(TRACKING_TABLE).where({ order_id: orderId }).first();
  if (existing) {
    await db(TRACKING_TABLE).where({ order_id: orderId }).update(data);
    return db(TRACKING_TABLE).where({ order_id: orderId }).first();
  }
  const [id] = await db(TRACKING_TABLE).insert({ order_id: orderId, ...data });
  return db(TRACKING_TABLE).where({ id }).first();
}

module.exports = {
  findById,
  findByOrderNumber,
  findByUserId,
  countByUserId,
  findAll,
  count,
  create,
  update,
  findItemsByOrderId,
  findItemById,
  createItem,
  addStatusHistory,
  findStatusHistory,
  findTracking,
  upsertTracking,
};
