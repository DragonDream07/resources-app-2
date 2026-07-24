const db = require('../client');

const TABLE = 'notifications';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByUserId(userId, { limit = 20, offset = 0, unreadOnly = false } = {}) {
  const query = db(TABLE)
    .where({ user_id: userId })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);

  if (unreadOnly) {
    query.where({ is_read: false });
  }

  return query;
}

async function countByUserId(userId, { unreadOnly = false } = {}) {
  const query = db(TABLE).where({ user_id: userId }).count('id as total');
  if (unreadOnly) {
    query.where({ is_read: false });
  }
  const [{ total }] = await query;
  return Number(total);
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

async function markAsRead(id, userId) {
  await db(TABLE).where({ id, user_id: userId }).update({ is_read: true });
  return findById(id);
}

async function markAllAsRead(userId) {
  return db(TABLE).where({ user_id: userId, is_read: false }).update({ is_read: true });
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
  findByUserId,
  countByUserId,
  create,
  markAsRead,
  markAllAsRead,
  update,
  remove,
};
