const cartService = require('./cart.service');

const createCart = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { guestId } = req.body;
    const cart = await cartService.createCart({ userId, guestId });
    return res.status(201).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

const getCart = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const userId = req.user ? req.user.id : null;
    const cart = await cartService.getCart({ cartId, userId });
    return res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const userId = req.user ? req.user.id : null;
    const { skuId, quantity } = req.body;
    const cart = await cartService.addItem({ cartId, userId, skuId, quantity });
    return res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { cartId, itemId } = req.params;
    const userId = req.user ? req.user.id : null;
    const { quantity } = req.body;
    const cart = await cartService.updateItem({ cartId, itemId, userId, quantity });
    return res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const { cartId, itemId } = req.params;
    const userId = req.user ? req.user.id : null;
    const cart = await cartService.removeItem({ cartId, itemId, userId });
    return res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

const applyPromo = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const userId = req.user ? req.user.id : null;
    const { promoCode } = req.body;
    const cart = await cartService.applyPromo({ cartId, userId, promoCode });
    return res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

const removePromo = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const userId = req.user ? req.user.id : null;
    const cart = await cartService.removePromo({ cartId, userId });
    return res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCart,
  getCart,
  addItem,
  updateItem,
  removeItem,
  applyPromo,
  removePromo,
};
