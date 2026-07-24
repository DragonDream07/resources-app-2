const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../../middleware/validation.middleware');

const VALID_DISCOUNT_TYPES = ['percentage', 'flat', 'free_shipping'];

const validatePromoCode = [
  param('cartId')
    .notEmpty()
    .withMessage('Cart ID is required.')
    .isInt({ min: 1 })
    .withMessage('Cart ID must be a positive integer.'),
  body('code')
    .notEmpty()
    .withMessage('Promo code is required.')
    .isString()
    .withMessage('Promo code must be a string.')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Promo code must be between 1 and 100 characters.'),
  handleValidationErrors,
];

const validateCreatePromoCode = [
  body('code')
    .notEmpty()
    .withMessage('Promo code is required.')
    .isString()
    .withMessage('Promo code must be a string.')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Promo code must be between 1 and 100 characters.')
    .matches(/^[A-Za-z0-9_\-]+$/)
    .withMessage('Promo code may only contain letters, numbers, hyphens, and underscores.'),
  body('discount_type')
    .notEmpty()
    .withMessage('Discount type is required.')
    .isIn(VALID_DISCOUNT_TYPES)
    .withMessage(`Discount type must be one of: ${VALID_DISCOUNT_TYPES.join(', ')}.`),
  body('discount_value')
    .notEmpty()
    .withMessage('Discount value is required.')
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a non-negative number.'),
  body('max_discount_value')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Max discount value must be a non-negative number.'),
  body('min_order_value')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Min order value must be a non-negative number.'),
  body('usage_limit')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Usage limit must be a positive integer.'),
  body('per_user_limit')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Per-user limit must be a positive integer.'),
  body('valid_from')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Valid from must be a valid ISO 8601 date.'),
  body('valid_until')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Valid until must be a valid ISO 8601 date.'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean.'),
  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be a string.')
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters.'),
  handleValidationErrors,
];

const validateUpdatePromoCode = [
  param('promoCodeId')
    .notEmpty()
    .withMessage('Promo code ID is required.')
    .isInt({ min: 1 })
    .withMessage('Promo code ID must be a positive integer.'),
  body('code')
    .optional()
    .isString()
    .withMessage('Promo code must be a string.')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Promo code must be between 1 and 100 characters.')
    .matches(/^[A-Za-z0-9_\-]+$/)
    .withMessage('Promo code may only contain letters, numbers, hyphens, and underscores.'),
  body('discount_type')
    .optional()
    .isIn(VALID_DISCOUNT_TYPES)
    .withMessage(`Discount type must be one of: ${VALID_DISCOUNT_TYPES.join(', ')}.`),
  body('discount_value')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a non-negative number.'),
  body('max_discount_value')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Max discount value must be a non-negative number.'),
  body('min_order_value')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Min order value must be a non-negative number.'),
  body('usage_limit')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Usage limit must be a positive integer.'),
  body('per_user_limit')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Per-user limit must be a positive integer.'),
  body('valid_from')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Valid from must be a valid ISO 8601 date.'),
  body('valid_until')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Valid until must be a valid ISO 8601 date.'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean.'),
  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be a string.')
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters.'),
  handleValidationErrors,
];

module.exports = {
  validatePromoCode,
  validateCreatePromoCode,
  validateUpdatePromoCode,
};
