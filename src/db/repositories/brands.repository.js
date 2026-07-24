const db = require('../client');

const TABLE = 'brands';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findBySlug(slug) {
  return db(TABLE).where({ slug }).first();
}

async function findAll({ limit = 100, offset = 0, includeInactive = false } = {}) {
  const query = db(TABLE).limit(limit).offset(offset).orderBy('name', 'asc');
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

module.exports = {
  findById,
  findBySlug,
  findAll,
  count,
  create,
  update,
  remove,
};
