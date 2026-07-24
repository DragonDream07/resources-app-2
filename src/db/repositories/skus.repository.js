const db = require('../client');

const TABLE = 'skus';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByProductId(productId) {
  return db(TABLE).where({ product_id: productId }).orderBy('created_at', 'asc');
}

async function findBySkuCode(skuCode) {
  return db(TABLE).where({ sku_code: skuCode }).first();
}

async function findByIds(ids) {
  return db(TABLE).whereIn('id', ids);
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

async function update(id, data) {
  await db(TABLE).where({ id }).update(data);
  return findById(id);
}

async function remove(id) {
  return db(TABLE).where({ id }).delete();
}

async function decrementStock(id, quantity, trx = db) {
  const affected = await trx(TABLE)
    .where({ id })
    .where('stock_quantity', '>=', quantity)
    .decrement('stock_quantity', quantity);
  return affected > 0;
}

async function incrementStock(id, quantity, trx = db) {
  await trx(TABLE).where({ id }).increment('stock_quantity', quantity);
  return findById(id);
}

async function atomicDecrementStock(id, quantity) {
  return db.transaction(async (trx) => {
    const success = await decrementStock(id, quantity, trx);
    if (!success) {
      throw new Error(`Insufficient stock for SKU ${id}`);
    }
    return trx(TABLE).where({ id }).first();
  });
}

async function findActiveByProductId(productId) {
  return db(TABLE).where({ product_id: productId, is_active: true }).orderBy('created_at', 'asc');
}

module.exports = {
  findById,
  findByProductId,
  findBySkuCode,
  findByIds,
  create,
  update,
  remove,
  decrementStock,
  incrementStock,
  atomicDecrementStock,
  findActiveByProductId,
};
