const express = require('express');
const router = express.Router();
const checkoutController = require('./checkout.controller');
const { validateCheckoutStart, validateCheckoutAddress, validateCheckoutPlaceOrder } = require('./checkout.validator');
const { authenticate, optionalAuthenticate } = require('../../middleware/auth.middleware');

// POST /checkout/start — begin checkout session (supports guest checkout)
router.post('/start', optionalAuthenticate, validateCheckoutStart, checkoutController.startCheckout);

// POST /checkout/address — submit / update delivery address for session
router.post('/address', optionalAuthenticate, validateCheckoutAddress, checkoutController.submitAddress);

// GET /checkout/review — retrieve order summary before placing
router.get('/review', optionalAuthenticate, checkoutController.reviewCheckout);

// POST /checkout/place-order — finalise and place the order
router.post('/place-order', optionalAuthenticate, validateCheckoutPlaceOrder, checkoutController.placeOrder);

module.exports = router;
