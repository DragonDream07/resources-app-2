const db = require('../client');

const TABLE = 'payment_attempts';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByOrderId(orderId) {
  return db(TABLE).where({ order_id: orderId }).orderBy('created_at', 'desc');
}

async function findLatestByOrderId(orderId) {
  return db(TABLE).where({ order_id: orderId }).orderBy('created_at', 'desc').first();
}

async function findByGatewayReference(gatewayReference) {
  return db(TABLE).where({ gateway_reference: gatewayReference }).first();
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

async function update(id, data) {
  await db(TABLE).where({ id }).update(data);
  return findById(id);
}

async function findSuccessfulByOrderId(orderId) {
  return db(TABLE).where({ order_id: orderId, status: 'success' }).first();
}

module.exports = {
  findById,
  findByOrderId,
  findLatestByOrderId,
  findByGatewayReference,
  create,
  update,
  findSuccessfulByOrderId,
};
