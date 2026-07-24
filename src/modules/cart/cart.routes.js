const express = require('express');
const router = express.Router();
const cartController = require('./cart.controller');
const { validateCreateCart, validateAddItem, validateUpdateItem, validateApplyPromo } = require('./cart.validator');
const { authenticate, optionalAuthenticate } = require('../../middleware/auth');

// POST /carts
router.post('/', optionalAuthenticate, validateCreateCart, cartController.createCart);

// GET /carts/:cartId
router.get('/:cartId', optionalAuthenticate, cartController.getCart);

// POST /carts/:cartId/items
router.post('/:cartId/items', optionalAuthenticate, validateAddItem, cartController.addItem);

// PATCH /carts/:cartId/items/:itemId
router.patch('/:cartId/items/:itemId', optionalAuthenticate, validateUpdateItem, cartController.updateItem);

// DELETE /carts/:cartId/items/:itemId
router.delete('/:cartId/items/:itemId', optionalAuthenticate, cartController.removeItem);

// POST /carts/:cartId/promo
router.post('/:cartId/promo', optionalAuthenticate, validateApplyPromo, cartController.applyPromo);

// DELETE /carts/:cartId/promo
router.delete('/:cartId/promo', optionalAuthenticate, cartController.removePromo);

module.exports = router;
