const db = require('../client');

const TABLE = 'addresses';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByIdAndUserId(id, userId) {
  return db(TABLE).where({ id, user_id: userId }).first();
}

async function findAllByUserId(userId) {
  return db(TABLE).where({ user_id: userId }).orderBy('created_at', 'desc');
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

async function update(id, userId, data) {
  await db(TABLE).where({ id, user_id: userId }).update(data);
  return findByIdAndUserId(id, userId);
}

async function remove(id, userId) {
  return db(TABLE).where({ id, user_id: userId }).delete();
}

async function setDefaultAddress(userId, addressId) {
  return db.transaction(async (trx) => {
    await trx(TABLE).where({ user_id: userId }).update({ is_default: false });
    await trx(TABLE).where({ id: addressId, user_id: userId }).update({ is_default: true });
  });
}

module.exports = {
  findById,
  findByIdAndUserId,
  findAllByUserId,
  create,
  update,
  remove,
  setDefaultAddress,
};
