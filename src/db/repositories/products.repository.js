const db = require('../client');

const PRODUCTS_TABLE = 'products';
const IMAGES_TABLE = 'product_images';

async function findById(id) {
  return db(PRODUCTS_TABLE).where({ id }).first();
}

async function findBySlug(slug) {
  return db(PRODUCTS_TABLE).where({ slug }).first();
}

async function findAll({
  limit = 20,
  offset = 0,
  categoryId,
  brandId,
  isActive,
  orderBy = 'created_at',
  orderDir = 'desc',
} = {}) {
  const query = db(PRODUCTS_TABLE).limit(limit).offset(offset).orderBy(orderBy, orderDir);

  if (categoryId !== undefined) {
    query.where({ category_id: categoryId });
  }
  if (brandId !== undefined) {
    query.where({ brand_id: brandId });
  }
  if (isActive !== undefined) {
    query.where({ is_active: isActive });
  }

  return query;
}

async function findAllInCategories(categoryIds, { limit = 20, offset = 0, isActive = true } = {}) {
  const query = db(PRODUCTS_TABLE)
    .whereIn('category_id', categoryIds)
    .limit(limit)
    .offset(offset)
    .orderBy('created_at', 'desc');

  if (isActive !== undefined) {
    query.where({ is_active: isActive });
  }

  return query;
}

async function count({ categoryId, brandId, isActive } = {}) {
  const query = db(PRODUCTS_TABLE).count('id as total');

  if (categoryId !== undefined) {
    query.where({ category_id: categoryId });
  }
  if (brandId !== undefined) {
    query.where({ brand_id: brandId });
  }
  if (isActive !== undefined) {
    query.where({ is_active: isActive });
  }

  const [{ total }] = await query;
  return Number(total);
}

async function countInCategories(categoryIds, { isActive = true } = {}) {
  const query = db(PRODUCTS_TABLE).whereIn('category_id', categoryIds).count('id as total');

  if (isActive !== undefined) {
    query.where({ is_active: isActive });
  }

  const [{ total }] = await query;
  return Number(total);
}

async function create(data) {
  const [id] = await db(PRODUCTS_TABLE).insert(data);
  return findById(id);
}

async function update(id, data) {
  await db(PRODUCTS_TABLE).where({ id }).update(data);
  return findById(id);
}

async function remove(id) {
  return db(PRODUCTS_TABLE).where({ id }).delete();
}

async function findImagesByProductId(productId) {
  return db(IMAGES_TABLE).where({ product_id: productId }).orderBy('sort_order', 'asc');
}

async function addImage(data) {
  const [id] = await db(IMAGES_TABLE).insert(data);
  return db(IMAGES_TABLE).where({ id }).first();
}

async function removeImage(id) {
  return db(IMAGES_TABLE).where({ id }).delete();
}

async function removeImagesByProductId(productId) {
  return db(IMAGES_TABLE).where({ product_id: productId }).delete();
}

async function findByIds(ids) {
  return db(PRODUCTS_TABLE).whereIn('id', ids);
}

module.exports = {
  findById,
  findBySlug,
  findAll,
  findAllInCategories,
  count,
  countInCategories,
  create,
  update,
  remove,
  findImagesByProductId,
  addImage,
  removeImage,
  removeImagesByProductId,
  findByIds,
};
