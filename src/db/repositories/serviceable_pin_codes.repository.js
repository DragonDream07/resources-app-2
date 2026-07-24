const db = require('../client');

const TABLE = 'serviceable_pin_codes';

async function findByPinCode(pinCode) {
  return db(TABLE).where({ pin_code: pinCode }).first();
}

async function isServiceable(pinCode) {
  const record = await findByPinCode(pinCode);
  return !!record && record.is_active === true;
}

async function findAll({ limit = 100, offset = 0 } = {}) {
  return db(TABLE).limit(limit).offset(offset);
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return db(TABLE).where({ id }).first();
}

async function update(id, data) {
  await db(TABLE).where({ id }).update(data);
  return db(TABLE).where({ id }).first();
}

async function remove(id) {
  return db(TABLE).where({ id }).delete();
}

module.exports = {
  findByPinCode,
  isServiceable,
  findAll,
  create,
  update,
  remove,
};
