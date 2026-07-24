const db = require('../client');

const TABLE = 'return_requests';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByOrderId(orderId) {
  return db(TABLE).where({ order_id: orderId }).orderBy('created_at', 'desc');
}

async function findByUserId(userId, { limit = 20, offset = 0 } = {}) {
  return db(TABLE).where({ user_id: userId }).orderBy('created_at', 'desc').limit(limit).offset(offset);
}

async function findAll({ limit = 20, offset = 0, status } = {}) {
  const query = db(TABLE).orderBy('created_at', 'desc').limit(limit).offset(offset);
  if (status) {
    query.where({ status });
  }
  return query;
}

async function count({ status } = {}) {
  const query = db(TABLE).count('id as total');
  if (status) {
    query.where({ status });
  }
  const [{ total }] = await query;
  return Number(total);
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

async function update(id, data) {
  await db(TABLE).where({ id }).update(data);
  return findById(id);
}

async function findByIdAndUserId(id, userId) {
  return db(TABLE).where({ id, user_id: userId }).first();
}

module.exports = {
  findById,
  findByOrderId,
  findByUserId,
  findAll,
  count,
  create,
  update,
  findByIdAndUserId,
};
