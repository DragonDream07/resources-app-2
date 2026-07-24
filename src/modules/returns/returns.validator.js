const { body, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

/**
 * Validation schema for initiating a return request.
 * POST /orders/:orderId/return-requests
 */
const validateCreateReturnRequest = [
  body('reason')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Reason is required.')
    .isString()
    .withMessage('Reason must be a string.')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Reason must be between 10 and 1000 characters.'),

  body('items')
    .optional()
    .isArray()
    .withMessage('Items must be an array.'),

  body('items.*.sku_id')
    .optional()
    .isString()
    .withMessage('Each item sku_id must be a string.'),

  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Each item quantity must be a positive integer.'),

  handleValidationErrors,
];

/**
 * Validation schema for reviewing (approving/rejecting) a return request.
 * POST /return-requests/:returnRequestId/review
 */
const validateReviewReturnRequest = [
  body('decision')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Decision is required.')
    .isIn(['approved', 'rejected'])
    .withMessage('Decision must be either "approved" or "rejected".'),

  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string.')
    .isLength({ max: 2000 })
    .withMessage('Notes must not exceed 2000 characters.'),

  handleValidationErrors,
];

module.exports = {
  validateCreateReturnRequest,
  validateReviewReturnRequest,
};
