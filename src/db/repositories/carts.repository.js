const db = require('../client');

const CARTS_TABLE = 'carts';
const ITEMS_TABLE = 'cart_items';

async function findCartById(id) {
  return db(CARTS_TABLE).where({ id }).first();
}

async function findCartByUserId(userId) {
  return db(CARTS_TABLE).where({ user_id: userId }).first();
}

async function findCartBySessionId(sessionId) {
  return db(CARTS_TABLE).where({ session_id: sessionId }).first();
}

async function createCart(data) {
  const [id] = await db(CARTS_TABLE).insert(data);
  return findCartById(id);
}

async function updateCart(id, data) {
  await db(CARTS_TABLE).where({ id }).update(data);
  return findCartById(id);
}

async function deleteCart(id) {
  return db(CARTS_TABLE).where({ id }).delete();
}

async function findItemById(id) {
  return db(ITEMS_TABLE).where({ id }).first();
}

async function findItemByCartAndSku(cartId, skuId) {
  return db(ITEMS_TABLE).where({ cart_id: cartId, sku_id: skuId }).first();
}

async function findItemsByCartId(cartId) {
  return db(ITEMS_TABLE).where({ cart_id: cartId });
}

async function addItem(data) {
  const [id] = await db(ITEMS_TABLE).insert(data);
  return findItemById(id);
}

async function updateItem(id, data) {
  await db(ITEMS_TABLE).where({ id }).update(data);
  return findItemById(id);
}

async function removeItem(id) {
  return db(ITEMS_TABLE).where({ id }).delete();
}

async function removeItemsByCartId(cartId) {
  return db(ITEMS_TABLE).where({ cart_id: cartId }).delete();
}

async function countItems(cartId) {
  const [{ total }] = await db(ITEMS_TABLE).where({ cart_id: cartId }).count('id as total');
  return Number(total);
}

module.exports = {
  findCartById,
  findCartByUserId,
  findCartBySessionId,
  createCart,
  updateCart,
  deleteCart,
  findItemById,
  findItemByCartAndSku,
  findItemsByCartId,
  addItem,
  updateItem,
  removeItem,
  removeItemsByCartId,
  countItems,
};
