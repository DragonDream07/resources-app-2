const Joi = require('joi');

// ── Param schemas ─────────────────────────────────────────────────────────────

const productIdParamSchema = Joi.object({
  productId: Joi.string().uuid().required().messages({
    'string.guid': 'productId must be a valid UUID',
    'any.required': 'productId is required',
  }),
});

const skuIdParamSchema = Joi.object({
  productId: Joi.string().uuid().required().messages({
    'string.guid': 'productId must be a valid UUID',
    'any.required': 'productId is required',
  }),
  skuId: Joi.string().uuid().required().messages({
    'string.guid': 'skuId must be a valid UUID',
    'any.required': 'skuId is required',
  }),
});

const imageIdParamSchema = Joi.object({
  productId: Joi.string().uuid().required().messages({
    'string.guid': 'productId must be a valid UUID',
    'any.required': 'productId is required',
  }),
  imageId: Joi.string().uuid().required().messages({
    'string.guid': 'imageId must be a valid UUID',
    'any.required': 'imageId is required',
  }),
});

const categoryIdParamSchema = Joi.object({
  categoryId: Joi.string().uuid().required().messages({
    'string.guid': 'categoryId must be a valid UUID',
    'any.required': 'categoryId is required',
  }),
});

const brandIdParamSchema = Joi.object({
  brandId: Joi.string().uuid().required().messages({
    'string.guid': 'brandId must be a valid UUID',
    'any.required': 'brandId is required',
  }),
});

// ── Query schemas ─────────────────────────────────────────────────────────────

const productQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'page must be a number',
    'number.min': 'page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    'number.base': 'limit must be a number',
    'number.min': 'limit must be at least 1',
    'number.max': 'limit must not exceed 100',
  }),
  sort_by: Joi.string().valid('name', 'base_price', 'created_at').default('created_at').messages({
    'any.only': 'sort_by must be one of name, base_price, created_at',
  }),
  sort_dir: Joi.string().valid('asc', 'desc').default('desc').messages({
    'any.only': 'sort_dir must be one of asc, desc',
  }),
  search: Joi.string().max(255).optional().messages({
    'string.max': 'search must not exceed 255 characters',
  }),
  category_id: Joi.string().uuid().optional().messages({
    'string.guid': 'category_id must be a valid UUID',
  }),
  brand_id: Joi.string().uuid().optional().messages({
    'string.guid': 'brand_id must be a valid UUID',
  }),
  min_price: Joi.number().min(0).optional().messages({
    'number.base': 'min_price must be a number',
    'number.min': 'min_price must be at least 0',
  }),
  max_price: Joi.number().min(0).optional().messages({
    'number.base': 'max_price must be a number',
    'number.min': 'max_price must be at least 0',
  }),
});

// ── Product schemas ───────────────────────────────────────────────────────────

const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    'string.base': 'Product name must be a string',
    'string.empty': 'Product name is required',
    'string.min': 'Product name must be at least 1 character',
    'string.max': 'Product name must not exceed 255 characters',
    'any.required': 'Product name is required',
  }),
  description: Joi.string().max(5000).optional().allow('').messages({
    'string.max': 'Description must not exceed 5000 characters',
  }),
  base_price: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Base price must be a number',
    'number.positive': 'Base price must be a positive number',
    'any.required': 'Base price is required',
  }),
  category_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'category_id must be a valid UUID',
  }),
  brand_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'brand_id must be a valid UUID',
  }),
  is_active: Joi.boolean().default(true),
  metadata: Joi.object().optional().default({}),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional().messages({
    'string.base': 'Product name must be a string',
    'string.min': 'Product name must be at least 1 character',
    'string.max': 'Product name must not exceed 255 characters',
  }),
  description: Joi.string().max(5000).optional().allow('').messages({
    'string.max': 'Description must not exceed 5000 characters',
  }),
  base_price: Joi.number().positive().precision(2).optional().messages({
    'number.base': 'Base price must be a number',
    'number.positive': 'Base price must be a positive number',
  }),
  category_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'category_id must be a valid UUID',
  }),
  brand_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'brand_id must be a valid UUID',
  }),
  is_active: Joi.boolean().optional(),
  metadata: Joi.object().optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

// ── Product image schemas ─────────────────────────────────────────────────────

const productImageSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    'string.base': 'Image URL must be a string',
    'string.uri': 'Image URL must be a valid URL',
    'any.required': 'Image URL is required',
  }),
  alt_text: Joi.string().max(255).optional().allow('').messages({
    'string.max': 'Alt text must not exceed 255 characters',
  }),
  sort_order: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'sort_order must be a number',
    'number.min': 'sort_order must be at least 0',
  }),
});

// ── SKU schemas ───────────────────────────────────────────────────────────────

const createSkuSchema = Joi.object({
  sku_code: Joi.string().min(1).max(100).required().messages({
    'string.base': 'SKU code must be a string',
    'string.empty': 'SKU code is required',
    'string.min': 'SKU code must be at least 1 character',
    'string.max': 'SKU code must not exceed 100 characters',
    'any.required': 'SKU code is required',
  }),
  price: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be a positive number',
    'any.required': 'Price is required',
  }),
  stock_quantity: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'Stock quantity must be a number',
    'number.integer': 'Stock quantity must be an integer',
    'number.min': 'Stock quantity must be at least 0',
  }),
  attributes: Joi.object().optional().default({}),
});

const updateSkuSchema = Joi.object({
  sku_code: Joi.string().min(1).max(100).optional().messages({
    'string.base': 'SKU code must be a string',
    'string.min': 'SKU code must be at least 1 character',
    'string.max': 'SKU code must not exceed 100 characters',
  }),
  price: Joi.number().positive().precision(2).optional().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be a positive number',
  }),
  stock_quantity: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Stock quantity must be a number',
    'number.integer': 'Stock quantity must be an integer',
    'number.min': 'Stock quantity must be at least 0',
  }),
  attributes: Joi.object().optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

// ── Category schemas ──────────────────────────────────────────────────────────

const createCategorySchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    'string.base': 'Category name must be a string',
    'string.empty': 'Category name is required',
    'string.min': 'Category name must be at least 1 character',
    'string.max': 'Category name must not exceed 255 characters',
    'any.required': 'Category name is required',
  }),
  description: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Description must not exceed 2000 characters',
  }),
  parent_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'parent_id must be a valid UUID',
  }),
  image_url: Joi.string().uri().optional().allow(null, '').messages({
    'string.uri': 'image_url must be a valid URL',
  }),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(1).max(255).optional().messages({
    'string.base': 'Category name must be a string',
    'string.min': 'Category name must be at least 1 character',
    'string.max': 'Category name must not exceed 255 characters',
  }),
  description: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Description must not exceed 2000 characters',
  }),
  parent_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'parent_id must be a valid UUID',
  }),
  image_url: Joi.string().uri().optional().allow(null, '').messages({
    'string.uri': 'image_url must be a valid URL',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

// ── Brand schemas ─────────────────────────────────────────────────────────────

const createBrandSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    'string.base': 'Brand name must be a string',
    'string.empty': 'Brand name is required',
    'string.min': 'Brand name must be at least 1 character',
    'string.max': 'Brand name must not exceed 255 characters',
    'any.required': 'Brand name is required',
  }),
  description: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Description must not exceed 2000 characters',
  }),
  logo_url: Joi.string().uri().optional().allow(null, '').messages({
    'string.uri': 'logo_url must be a valid URL',
  }),
});

const updateBrandSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional().messages({
    'string.base': 'Brand name must be a string',
    'string.min': 'Brand name must be at least 1 character',
    'string.max': 'Brand name must not exceed 255 characters',
  }),
  description: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Description must not exceed 2000 characters',
  }),
  logo_url: Joi.string().uri().optional().allow(null, '').messages({
    'string.uri': 'logo_url must be a valid URL',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  createSkuSchema,
  updateSkuSchema,
  createCategorySchema,
  updateCategorySchema,
  createBrandSchema,
  updateBrandSchema,
  productImageSchema,
  productIdParamSchema,
  skuIdParamSchema,
  imageIdParamSchema,
  categoryIdParamSchema,
  brandIdParamSchema,
  productQuerySchema,
};
