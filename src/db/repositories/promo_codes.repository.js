const db = require('../client');

const TABLE = 'promo_codes';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByCode(code) {
  return db(TABLE).where({ code }).first();
}

async function findAll({ limit = 50, offset = 0, includeInactive = false } = {}) {
  const query = db(TABLE).limit(limit).offset(offset).orderBy('created_at', 'desc');
  if (!includeInactive) {
    query.where({ is_active: true });
  }
  return query;
}

async function count({ includeInactive = false } = {}) {
  const query = db(TABLE).count('id as total');
  if (!includeInactive) {
    query.where({ is_active: true });
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

async function remove(id) {
  return db(TABLE).where({ id }).delete();
}

async function incrementUsageCount(id, trx = db) {
  return trx(TABLE).where({ id }).increment('usage_count', 1);
}

module.exports = {
  findById,
  findByCode,
  findAll,
  count,
  create,
  update,
  remove,
  incrementUsageCount,
};
