const checkoutService = require('./checkout.service');
const { AppError } = require('../../utils/errors');

/**
 * POST /checkout/start
 * Initiates a checkout session. Accepts cartId and optional guestToken.
 */
async function startCheckout(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const { cartId, guestToken } = req.body;
    const result = await checkoutService.startCheckout({ cartId, guestToken, userId });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /checkout/address
 * Validates and persists the delivery address for the active checkout session.
 */
async function submitAddress(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const { checkoutSessionId, address, addressId } = req.body;
    const result = await checkoutService.submitAddress({ checkoutSessionId, address, addressId, userId });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /checkout/review
 * Returns the full order summary for the active checkout session.
 */
async function reviewCheckout(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const { checkoutSessionId } = req.query;
    const result = await checkoutService.reviewCheckout({ checkoutSessionId, userId });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /checkout/place-order
 * Finalises the checkout: confirms stock, applies promo, creates order,
 * and delegates payment intent creation.
 */
async function placeOrder(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const { checkoutSessionId, paymentMethod, guestToken } = req.body;
    const result = await checkoutService.placeOrder({ checkoutSessionId, paymentMethod, guestToken, userId });
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    return next(err);
  }
}

module.exports = { startCheckout, submitAddress, reviewCheckout, placeOrder };
