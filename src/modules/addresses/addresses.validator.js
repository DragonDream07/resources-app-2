const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

const createAddress = [
  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required.'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required.')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Phone number must be a valid 10-digit Indian mobile number.'),

  body('address_line1')
    .trim()
    .notEmpty()
    .withMessage('Address line 1 is required.'),

  body('address_line2')
    .optional()
    .trim(),

  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required.'),

  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required.'),

  body('pin_code')
    .trim()
    .notEmpty()
    .withMessage('PIN code is required.')
    .matches(/^\d{6}$/)
    .withMessage('PIN code must be a valid 6-digit code.'),

  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required.'),

  body('is_default')
    .optional()
    .isBoolean()
    .withMessage('is_default must be a boolean value.'),

  body('address_type')
    .optional()
    .trim()
    .isIn(['home', 'work', 'other'])
    .withMessage('address_type must be one of: home, work, other.'),

  handleValidationErrors,
];

const updateAddress = [
  body('full_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full name cannot be empty.'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Phone number must be a valid 10-digit Indian mobile number.'),

  body('address_line1')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Address line 1 cannot be empty.'),

  body('address_line2')
    .optional()
    .trim(),

  body('city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City cannot be empty.'),

  body('state')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('State cannot be empty.'),

  body('pin_code')
    .optional()
    .trim()
    .matches(/^\d{6}$/)
    .withMessage('PIN code must be a valid 6-digit code.'),

  body('country')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Country cannot be empty.'),

  body('is_default')
    .optional()
    .isBoolean()
    .withMessage('is_default must be a boolean value.'),

  body('address_type')
    .optional()
    .trim()
    .isIn(['home', 'work', 'other'])
    .withMessage('address_type must be one of: home, work, other.'),

  handleValidationErrors,
];

module.exports = {
  createAddress,
  updateAddress,
};
