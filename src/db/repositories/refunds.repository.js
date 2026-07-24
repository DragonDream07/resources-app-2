const db = require('../client');

const TABLE = 'refunds';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByOrderId(orderId) {
  return db(TABLE).where({ order_id: orderId }).orderBy('created_at', 'desc');
}

async function findByReturnRequestId(returnRequestId) {
  return db(TABLE).where({ return_request_id: returnRequestId }).first();
}

async function findByPaymentAttemptId(paymentAttemptId) {
  return db(TABLE).where({ payment_attempt_id: paymentAttemptId });
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

async function update(id, data) {
  await db(TABLE).where({ id }).update(data);
  return findById(id);
}

async function findAll({ limit = 20, offset = 0, status } = {}) {
  const query = db(TABLE).orderBy('created_at', 'desc').limit(limit).offset(offset);
  if (status) {
    query.where({ status });
  }
  return query;
}

module.exports = {
  findById,
  findByOrderId,
  findByReturnRequestId,
  findByPaymentAttemptId,
  create,
  update,
  findAll,
};
