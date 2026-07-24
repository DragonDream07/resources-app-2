const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../../middleware/validation.middleware');

const VALID_ADVANCE_STATUSES = [
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'return_requested',
  'returned',
  'refunded',
];

const validateAdvanceOrder = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(VALID_ADVANCE_STATUSES)
    .withMessage(`Status must be one of: ${VALID_ADVANCE_STATUSES.join(', ')}`),

  body('trackingNumber')
    .optional()
    .isString()
    .withMessage('Tracking number must be a string')
    .trim(),

  body('carrier')
    .optional()
    .isString()
    .withMessage('Carrier must be a string')
    .trim(),

  handleValidationErrors,
];

const validateCancelOrder = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required'),

  body('reason')
    .optional()
    .isString()
    .withMessage('Reason must be a string')
    .isLength({ max: 500 })
    .withMessage('Reason must not exceed 500 characters')
    .trim(),

  handleValidationErrors,
];

const validateReturnRequest = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required'),

  body('reason')
    .notEmpty()
    .withMessage('Reason is required')
    .isString()
    .withMessage('Reason must be a string')
    .isLength({ max: 1000 })
    .withMessage('Reason must not exceed 1000 characters')
    .trim(),

  body('items')
    .notEmpty()
    .withMessage('Items are required')
    .isArray({ min: 1 })
    .withMessage('Items must be a non-empty array'),

  body('items.*.orderItemId')
    .notEmpty()
    .withMessage('Each return item must have an orderItemId'),

  body('items.*.quantity')
    .notEmpty()
    .withMessage('Each return item must have a quantity')
    .isInt({ min: 1 })
    .withMessage('Item quantity must be a positive integer'),

  handleValidationErrors,
];

module.exports = {
  validateAdvanceOrder,
  validateCancelOrder,
  validateReturnRequest,
};
