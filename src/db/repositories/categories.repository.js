const db = require('../client');

const TABLE = 'categories';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findAll({ includeInactive = false } = {}) {
  const query = db(TABLE).orderBy('sort_order', 'asc').orderBy('name', 'asc');
  if (!includeInactive) {
    query.where({ is_active: true });
  }
  return query;
}

async function findRoots({ includeInactive = false } = {}) {
  const query = db(TABLE).whereNull('parent_id').orderBy('sort_order', 'asc');
  if (!includeInactive) {
    query.where({ is_active: true });
  }
  return query;
}

async function findChildren(parentId, { includeInactive = false } = {}) {
  const query = db(TABLE).where({ parent_id: parentId }).orderBy('sort_order', 'asc');
  if (!includeInactive) {
    query.where({ is_active: true });
  }
  return query;
}

async function findDescendants(categoryId) {
  const descendants = [];
  const queue = [categoryId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    const children = await db(TABLE).where({ parent_id: currentId });
    for (const child of children) {
      descendants.push(child);
      queue.push(child.id);
    }
  }

  return descendants;
}

async function findAncestors(categoryId) {
  const ancestors = [];
  let current = await findById(categoryId);

  while (current && current.parent_id != null) {
    current = await findById(current.parent_id);
    if (current) {
      ancestors.unshift(current);
    }
  }

  return ancestors;
}

async function findDescendantIds(categoryId) {
  const descendants = await findDescendants(categoryId);
  return [categoryId, ...descendants.map((d) => d.id)];
}

async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

async function update(id, data) {
  await db(TABLE).where({ id }).update(data);
  return findById(id);
}

async function remove(id) {
  return db(TABLE).where({ id }).delete();
}

async function findBySlug(slug) {
  return db(TABLE).where({ slug }).first();
}

module.exports = {
  findById,
  findAll,
  findRoots,
  findChildren,
  findDescendants,
  findAncestors,
  findDescendantIds,
  create,
  update,
  remove,
  findBySlug,
};
