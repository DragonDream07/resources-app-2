const db = require('../../config/db');
const { NotFoundError, ConflictError } = require('../../utils/errors');

// ── Helpers ─────────────────────────────────────────────────────────────────

const assertProductExists = async (productId) => {
  const { rows } = await db.query('SELECT id FROM products WHERE id = $1 AND deleted_at IS NULL', [productId]);
  if (!rows.length) throw new NotFoundError('Product not found');
  return rows[0];
};

const assertSkuExists = async (productId, skuId) => {
  const { rows } = await db.query(
    'SELECT id FROM skus WHERE id = $1 AND product_id = $2 AND deleted_at IS NULL',
    [skuId, productId]
  );
  if (!rows.length) throw new NotFoundError('SKU not found');
  return rows[0];
};

const assertCategoryExists = async (categoryId) => {
  const { rows } = await db.query('SELECT id FROM categories WHERE id = $1 AND deleted_at IS NULL', [categoryId]);
  if (!rows.length) throw new NotFoundError('Category not found');
  return rows[0];
};

const assertBrandExists = async (brandId) => {
  const { rows } = await db.query('SELECT id FROM brands WHERE id = $1 AND deleted_at IS NULL', [brandId]);
  if (!rows.length) throw new NotFoundError('Brand not found');
  return rows[0];
};

const assertImageExists = async (productId, imageId) => {
  const { rows } = await db.query(
    'SELECT id FROM product_images WHERE id = $1 AND product_id = $2',
    [imageId, productId]
  );
  if (!rows.length) throw new NotFoundError('Image not found');
  return rows[0];
};

// Build WHERE clause + params for product listing filters
const buildProductFilters = (query, startIdx = 1) => {
  const conditions = ['p.deleted_at IS NULL'];
  const params = [];
  let idx = startIdx;

  if (query.category_id) {
    conditions.push(`p.category_id = $${idx++}`);
    params.push(query.category_id);
  }
  if (query.brand_id) {
    conditions.push(`p.brand_id = $${idx++}`);
    params.push(query.brand_id);
  }
  if (query.min_price !== undefined) {
    conditions.push(`p.base_price >= $${idx++}`);
    params.push(Number(query.min_price));
  }
  if (query.max_price !== undefined) {
    conditions.push(`p.base_price <= $${idx++}`);
    params.push(Number(query.max_price));
  }
  if (query.search) {
    conditions.push(`(p.name ILIKE $${idx} OR p.description ILIKE $${idx})`);
    params.push(`%${query.search}%`);
    idx++;
  }

  return { conditions, params, nextIdx: idx };
};

// ── Products ─────────────────────────────────────────────────────────────────

const listProducts = async (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const offset = (page - 1) * limit;
  const sortBy = ['name', 'base_price', 'created_at'].includes(query.sort_by) ? query.sort_by : 'created_at';
  const sortDir = query.sort_dir === 'asc' ? 'ASC' : 'DESC';

  const { conditions, params, nextIdx } = buildProductFilters(query, 1);
  const where = conditions.join(' AND ');

  const countResult = await db.query(
    `SELECT COUNT(*) FROM products p WHERE ${where}`,
    params
  );
  const total = parseInt(countResult.rows[0].count);

  params.push(limit);
  params.push(offset);

  const { rows } = await db.query(
    `SELECT p.*, b.name AS brand_name, c.name AS category_name
     FROM products p
     LEFT JOIN brands b ON b.id = p.brand_id
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE ${where}
     ORDER BY p.${sortBy} ${sortDir}
     LIMIT $${nextIdx} OFFSET $${nextIdx + 1}`,
    params
  );

  return {
    data: rows,
    meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
  };
};

const getProduct = async (productId) => {
  const { rows } = await db.query(
    `SELECT p.*, b.name AS brand_name, c.name AS category_name
     FROM products p
     LEFT JOIN brands b ON b.id = p.brand_id
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.id = $1 AND p.deleted_at IS NULL`,
    [productId]
  );
  if (!rows.length) throw new NotFoundError('Product not found');

  const product = rows[0];

  const [imagesResult, skusResult] = await Promise.all([
    db.query('SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC', [productId]),
    db.query('SELECT * FROM skus WHERE product_id = $1 AND deleted_at IS NULL ORDER BY created_at ASC', [productId]),
  ]);

  product.images = imagesResult.rows;
  product.skus = skusResult.rows;

  return product;
};

const createProduct = async (data) => {
  const {
    name,
    description,
    base_price,
    category_id,
    brand_id,
    is_active = true,
    metadata = {},
  } = data;

  const { rows } = await db.query(
    `INSERT INTO products (name, description, base_price, category_id, brand_id, is_active, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [name, description, base_price, category_id, brand_id, is_active, JSON.stringify(metadata)]
  );
  return rows[0];
};

const updateProduct = async (productId, data) => {
  await assertProductExists(productId);

  const fields = [];
  const params = [];
  let idx = 1;

  const allowed = ['name', 'description', 'base_price', 'category_id', 'brand_id', 'is_active', 'metadata'];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = $${idx++}`);
      params.push(key === 'metadata' ? JSON.stringify(data[key]) : data[key]);
    }
  }

  if (!fields.length) {
    return getProduct(productId);
  }

  fields.push(`updated_at = NOW()`);
  params.push(productId);

  const { rows } = await db.query(
    `UPDATE products SET ${fields.join(', ')} WHERE id = $${idx} AND deleted_at IS NULL RETURNING *`,
    params
  );
  return rows[0];
};

const deleteProduct = async (productId) => {
  await assertProductExists(productId);
  await db.query(
    'UPDATE products SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL',
    [productId]
  );
};

// ── Product Images ────────────────────────────────────────────────────────────

const listProductImages = async (productId) => {
  await assertProductExists(productId);
  const { rows } = await db.query(
    'SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC',
    [productId]
  );
  return rows;
};

const addProductImage = async (productId, data) => {
  await assertProductExists(productId);
  const { url, alt_text = null, sort_order = 0 } = data;

  const { rows } = await db.query(
    `INSERT INTO product_images (product_id, url, alt_text, sort_order)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [productId, url, alt_text, sort_order]
  );
  return rows[0];
};

const deleteProductImage = async (productId, imageId) => {
  await assertProductExists(productId);
  await assertImageExists(productId, imageId);
  await db.query('DELETE FROM product_images WHERE id = $1 AND product_id = $2', [imageId, productId]);
};

// ── SKUs ──────────────────────────────────────────────────────────────────────

const listProductSkus = async (productId) => {
  await assertProductExists(productId);
  const { rows } = await db.query(
    'SELECT * FROM skus WHERE product_id = $1 AND deleted_at IS NULL ORDER BY created_at ASC',
    [productId]
  );
  return rows;
};

const getProductSku = async (productId, skuId) => {
  await assertProductExists(productId);
  const { rows } = await db.query(
    'SELECT * FROM skus WHERE id = $1 AND product_id = $2 AND deleted_at IS NULL',
    [skuId, productId]
  );
  if (!rows.length) throw new NotFoundError('SKU not found');
  return rows[0];
};

const createProductSku = async (productId, data) => {
  await assertProductExists(productId);
  const { sku_code, price, stock_quantity = 0, attributes = {} } = data;

  // Check SKU code uniqueness within product
  const existing = await db.query(
    'SELECT id FROM skus WHERE product_id = $1 AND sku_code = $2 AND deleted_at IS NULL',
    [productId, sku_code]
  );
  if (existing.rows.length) throw new ConflictError('SKU code already exists for this product');

  const { rows } = await db.query(
    `INSERT INTO skus (product_id, sku_code, price, stock_quantity, attributes)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [productId, sku_code, price, stock_quantity, JSON.stringify(attributes)]
  );
  return rows[0];
};

const updateProductSku = async (productId, skuId, data) => {
  await assertProductExists(productId);
  await assertSkuExists(productId, skuId);

  const fields = [];
  const params = [];
  let idx = 1;

  const allowed = ['sku_code', 'price', 'stock_quantity', 'attributes'];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = $${idx++}`);
      params.push(key === 'attributes' ? JSON.stringify(data[key]) : data[key]);
    }
  }

  if (!fields.length) {
    return getProductSku(productId, skuId);
  }

  fields.push(`updated_at = NOW()`);
  params.push(skuId);
  params.push(productId);

  const { rows } = await db.query(
    `UPDATE skus SET ${fields.join(', ')} WHERE id = $${idx} AND product_id = $${idx + 1} AND deleted_at IS NULL RETURNING *`,
    params
  );
  return rows[0];
};

const deleteProductSku = async (productId, skuId) => {
  await assertProductExists(productId);
  await assertSkuExists(productId, skuId);
  await db.query(
    'UPDATE skus SET deleted_at = NOW() WHERE id = $1 AND product_id = $2 AND deleted_at IS NULL',
    [skuId, productId]
  );
};

// ── Categories ────────────────────────────────────────────────────────────────

const listCategories = async () => {
  const { rows } = await db.query(
    'SELECT * FROM categories WHERE deleted_at IS NULL ORDER BY name ASC'
  );
  return rows;
};

const getCategory = async (categoryId) => {
  const { rows } = await db.query(
    'SELECT * FROM categories WHERE id = $1 AND deleted_at IS NULL',
    [categoryId]
  );
  if (!rows.length) throw new NotFoundError('Category not found');
  return rows[0];
};

const listCategoryProducts = async (categoryId, query) => {
  await assertCategoryExists(categoryId);
  return listProducts({ ...query, category_id: categoryId });
};

const createCategory = async (data) => {
  const { name, description = null, parent_id = null, image_url = null } = data;

  const existing = await db.query(
    'SELECT id FROM categories WHERE name = $1 AND deleted_at IS NULL',
    [name]
  );
  if (existing.rows.length) throw new ConflictError('Category name already exists');

  const { rows } = await db.query(
    `INSERT INTO categories (name, description, parent_id, image_url)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description, parent_id, image_url]
  );
  return rows[0];
};

const updateCategory = async (categoryId, data) => {
  await assertCategoryExists(categoryId);

  const fields = [];
  const params = [];
  let idx = 1;

  const allowed = ['name', 'description', 'parent_id', 'image_url'];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = $${idx++}`);
      params.push(data[key]);
    }
  }

  if (!fields.length) {
    return getCategory(categoryId);
  }

  fields.push(`updated_at = NOW()`);
  params.push(categoryId);

  const { rows } = await db.query(
    `UPDATE categories SET ${fields.join(', ')} WHERE id = $${idx} AND deleted_at IS NULL RETURNING *`,
    params
  );
  return rows[0];
};

const deleteCategory = async (categoryId) => {
  await assertCategoryExists(categoryId);

  // Check if any active products reference this category
  const { rows: productRows } = await db.query(
    'SELECT id FROM products WHERE category_id = $1 AND deleted_at IS NULL LIMIT 1',
    [categoryId]
  );
  if (productRows.length) throw new ConflictError('Cannot delete category with associated products');

  await db.query(
    'UPDATE categories SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL',
    [categoryId]
  );
};

// ── Brands ────────────────────────────────────────────────────────────────────

const listBrands = async () => {
  const { rows } = await db.query(
    'SELECT * FROM brands WHERE deleted_at IS NULL ORDER BY name ASC'
  );
  return rows;
};

const getBrand = async (brandId) => {
  const { rows } = await db.query(
    'SELECT * FROM brands WHERE id = $1 AND deleted_at IS NULL',
    [brandId]
  );
  if (!rows.length) throw new NotFoundError('Brand not found');

  // Include product thumbnails for the brand
  const { rows: products } = await db.query(
    `SELECT p.id, p.name, pi.url AS image_url
     FROM products p
     LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.sort_order = 0
     WHERE p.brand_id = $1 AND p.deleted_at IS NULL
     ORDER BY p.name ASC`,
    [brandId]
  );
  const brand = rows[0];
  brand.products = products;
  return brand;
};

const createBrand = async (data) => {
  const { name, description = null, logo_url = null } = data;

  const existing = await db.query(
    'SELECT id FROM brands WHERE name = $1 AND deleted_at IS NULL',
    [name]
  );
  if (existing.rows.length) throw new ConflictError('Brand name already exists');

  const { rows } = await db.query(
    `INSERT INTO brands (name, description, logo_url)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, description, logo_url]
  );
  return rows[0];
};

const updateBrand = async (brandId, data) => {
  await assertBrandExists(brandId);

  const fields = [];
  const params = [];
  let idx = 1;

  const allowed = ['name', 'description', 'logo_url'];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = $${idx++}`);
      params.push(data[key]);
    }
  }

  if (!fields.length) {
    return getBrand(brandId);
  }

  fields.push(`updated_at = NOW()`);
  params.push(brandId);

  const { rows } = await db.query(
    `UPDATE brands SET ${fields.join(', ')} WHERE id = $${idx} AND deleted_at IS NULL RETURNING *`,
    params
  );
  return rows[0];
};

const deleteBrand = async (brandId) => {
  await assertBrandExists(brandId);

  const { rows: productRows } = await db.query(
    'SELECT id FROM products WHERE brand_id = $1 AND deleted_at IS NULL LIMIT 1',
    [brandId]
  );
  if (productRows.length) throw new ConflictError('Cannot delete brand with associated products');

  await db.query(
    'UPDATE brands SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL',
    [brandId]
  );
};

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listProductImages,
  addProductImage,
  deleteProductImage,
  listProductSkus,
  getProductSku,
  createProductSku,
  updateProductSku,
  deleteProductSku,
  listCategories,
  getCategory,
  listCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory,
  listBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
