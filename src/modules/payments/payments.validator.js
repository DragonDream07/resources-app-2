const { body, param } = require('express-validator');
const { validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Validation failed.',
      details: errors.array(),
    });
  }
  next();
}

/**
 * Validation for POST /payments/initiate
 */
const validateInitiatePayment = [
  body('orderId')
    .notEmpty()
    .withMessage('orderId is required.')
    .isString()
    .withMessage('orderId must be a string.'),

  body('amount')
    .notEmpty()
    .withMessage('amount is required.')
    .isNumeric()
    .withMessage('amount must be a number.')
    .custom((value) => {
      if (Number(value) <= 0) {
        throw new Error('amount must be greater than zero.');
      }
      return true;
    }),

  body('currency')
    .optional()
    .isString()
    .withMessage('currency must be a string.')
    .isLength({ min: 3, max: 3 })
    .withMessage('currency must be a 3-letter ISO code.'),

  body('provider')
    .optional()
    .isString()
    .withMessage('provider must be a string.'),

  body('metadata')
    .optional()
    .isObject()
    .withMessage('metadata must be an object.'),

  handleValidationErrors,
];

/**
 * Validation for POST /payments/callback
 */
const validateCallback = [
  body('provider')
    .optional()
    .isString()
    .withMessage('provider must be a string.'),

  handleValidationErrors,
];

/**
 * Validation for POST /payments/:paymentId/retry
 */
const validateRetry = [
  param('paymentId')
    .notEmpty()
    .withMessage('paymentId is required.')
    .isString()
    .withMessage('paymentId must be a string.'),

  body('provider')
    .optional()
    .isString()
    .withMessage('provider must be a string.'),

  handleValidationErrors,
];

module.exports = {
  validateInitiatePayment,
  validateCallback,
  validateRetry,
};
