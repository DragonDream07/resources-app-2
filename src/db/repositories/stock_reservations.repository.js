const db = require('../client');

const TABLE = 'stock_reservations';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByOrderId(orderId) {
  return db(TABLE).where({ order_id: orderId });
}

async function findBySkuId(skuId) {
  return db(TABLE).where({ sku_id: skuId });
}

async function findActiveBySkuId(skuId) {
  return db(TABLE).where({ sku_id: skuId, status: 'reserved' });
}

async function create(data, trx = db) {
  const [id] = await trx(TABLE).insert(data);
  return trx(TABLE).where({ id }).first();
}

async function update(id, data, trx = db) {
  await trx(TABLE).where({ id }).update(data);
  return trx(TABLE).where({ id }).first();
}

async function releaseByOrderId(orderId, trx = db) {
  return trx(TABLE).where({ order_id: orderId, status: 'reserved' }).update({ status: 'released' });
}

async function confirmByOrderId(orderId, trx = db) {
  return trx(TABLE).where({ order_id: orderId, status: 'reserved' }).update({ status: 'confirmed' });
}

async function remove(id) {
  return db(TABLE).where({ id }).delete();
}

module.exports = {
  findById,
  findByOrderId,
  findBySkuId,
  findActiveBySkuId,
  create,
  update,
  releaseByOrderId,
  confirmByOrderId,
  remove,
};
