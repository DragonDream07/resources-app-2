'use strict';

const db = require('../../db');

// ---------------------------------------------------------------------------
// Reports & Dashboard (cross-domain read aggregations)
// ---------------------------------------------------------------------------

/**
 * getReports – aggregate cross-domain report data.
 * Delegates to direct DB queries against orders, users, products, returns.
 *
 * @param {object} opts
 * @param {string} [opts.from]  ISO date string, start of window
 * @param {string} [opts.to]    ISO date string, end of window
 * @param {string} [opts.type]  optional report type filter
 */
async function getReports({ from, to, type } = {}) {
  const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const toDate = to ? new Date(to) : new Date();

  const [ordersResult] = await db.query(
    `SELECT
       COUNT(*) AS total_orders,
       SUM(total_amount) AS revenue,
       AVG(total_amount) AS avg_order_value
     FROM orders
     WHERE created_at BETWEEN ? AND ?`,
    [fromDate, toDate]
  );

  const [usersResult] = await db.query(
    `SELECT COUNT(*) AS new_users
     FROM users
     WHERE created_at BETWEEN ? AND ?`,
    [fromDate, toDate]
  );

  const [returnsResult] = await db.query(
    `SELECT COUNT(*) AS total_returns
     FROM return_requests
     WHERE created_at BETWEEN ? AND ?`,
    [fromDate, toDate]
  );

  const [topProductsResult] = await db.query(
    `SELECT p.id, p.name, SUM(oi.quantity) AS units_sold
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     JOIN orders o ON o.id = oi.order_id
     WHERE o.created_at BETWEEN ? AND ?
     GROUP BY p.id, p.name
     ORDER BY units_sold DESC
     LIMIT 10`,
    [fromDate, toDate]
  );

  return {
    period: { from: fromDate, to: toDate },
    orders: {
      total: Number(ordersResult[0]?.total_orders || 0),
      revenue: Number(ordersResult[0]?.revenue || 0),
      avg_order_value: Number(ordersResult[0]?.avg_order_value || 0),
    },
    users: {
      new_users: Number(usersResult[0]?.new_users || 0),
    },
    returns: {
      total: Number(returnsResult[0]?.total_returns || 0),
    },
    top_products: topProductsResult,
  };
}

/**
 * getDashboardStats – lightweight snapshot for admin dashboard.
 */
async function getDashboardStats() {
  const [[orderStats]] = await db.query(
    `SELECT
       COUNT(*) AS total_orders,
       SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_orders,
       SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered_orders
     FROM orders`
  );

  const [[userStats]] = await db.query(
    `SELECT COUNT(*) AS total_users FROM users WHERE role != 'admin'`
  );

  const [[productStats]] = await db.query(
    `SELECT COUNT(*) AS total_products FROM products WHERE deleted_at IS NULL`
  );

  const [[returnStats]] = await db.query(
    `SELECT COUNT(*) AS pending_returns FROM return_requests WHERE status = 'pending'`
  );

  return {
    orders: {
      total: Number(orderStats?.total_orders || 0),
      pending: Number(orderStats?.pending_orders || 0),
      delivered: Number(orderStats?.delivered_orders || 0),
    },
    users: {
      total: Number(userStats?.total_users || 0),
    },
    products: {
      total: Number(productStats?.total_products || 0),
    },
    returns: {
      pending: Number(returnStats?.pending_returns || 0),
    },
  };
}

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------

/**
 * getPermissions – return all permissions from the permissions table.
 */
async function getPermissions() {
  const [rows] = await db.query(
    `SELECT id, name, description, created_at, updated_at FROM permissions ORDER BY name ASC`
  );
  return rows;
}

// ---------------------------------------------------------------------------
// Roles CRUD
// ---------------------------------------------------------------------------

/**
 * getRoles – return all roles.
 */
async function getRoles() {
  const [rows] = await db.query(
    `SELECT id, name, description, created_at, updated_at FROM roles ORDER BY name ASC`
  );
  return rows;
}

/**
 * createRole – insert a new role.
 */
async function createRole({ name, description }) {
  const [result] = await db.query(
    `INSERT INTO roles (name, description) VALUES (?, ?)`,
    [name, description || null]
  );
  const [rows] = await db.query(
    `SELECT id, name, description, created_at, updated_at FROM roles WHERE id = ?`,
    [result.insertId]
  );
  return rows[0];
}

/**
 * getRoleById – return a single role.
 */
async function getRoleById(roleId) {
  const [rows] = await db.query(
    `SELECT id, name, description, created_at, updated_at FROM roles WHERE id = ?`,
    [roleId]
  );
  return rows[0] || null;
}

/**
 * updateRole – update name / description of a role.
 */
async function updateRole(roleId, { name, description }) {
  const [result] = await db.query(
    `UPDATE roles SET name = COALESCE(?, name), description = COALESCE(?, description), updated_at = NOW() WHERE id = ?`,
    [name || null, description || null, roleId]
  );
  if (result.affectedRows === 0) return null;
  return getRoleById(roleId);
}

/**
 * deleteRole – remove a role by id.
 */
async function deleteRole(roleId) {
  await db.query(`DELETE FROM roles WHERE id = ?`, [roleId]);
}

// ---------------------------------------------------------------------------
// Role-Permission associations
// ---------------------------------------------------------------------------

/**
 * getRolePermissions – return permissions assigned to a role.
 */
async function getRolePermissions(roleId) {
  const [rows] = await db.query(
    `SELECT p.id, p.name, p.description
     FROM permissions p
     INNER JOIN role_permissions rp ON rp.permission_id = p.id
     WHERE rp.role_id = ?
     ORDER BY p.name ASC`,
    [roleId]
  );
  return rows;
}

/**
 * addPermissionToRole – associate a permission with a role.
 */
async function addPermissionToRole(roleId, permissionId) {
  await db.query(
    `INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)`,
    [roleId, permissionId]
  );
  const [rows] = await db.query(
    `SELECT p.id, p.name, p.description
     FROM permissions p
     WHERE p.id = ?`,
    [permissionId]
  );
  return rows[0];
}

/**
 * removePermissionFromRole – disassociate a permission from a role.
 */
async function removePermissionFromRole(roleId, permissionId) {
  await db.query(
    `DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?`,
    [roleId, permissionId]
  );
}

// ---------------------------------------------------------------------------
// Serviceable Pin Codes
// ---------------------------------------------------------------------------

/**
 * getServiceablePinCodes – paginated list with optional search.
 */
async function getServiceablePinCodes({ page = 1, limit = 20, search } = {}) {
  const offset = (page - 1) * limit;
  const likeParam = search ? `%${search}%` : null;

  let countQuery = `SELECT COUNT(*) AS total FROM serviceable_pin_codes`;
  let dataQuery  = `SELECT id, pin_code, city, state, is_active, created_at, updated_at FROM serviceable_pin_codes`;
  const countParams = [];
  const dataParams  = [];

  if (likeParam) {
    const whereClause = ` WHERE pin_code LIKE ? OR city LIKE ? OR state LIKE ?`;
    countQuery += whereClause;
    dataQuery  += whereClause;
    countParams.push(likeParam, likeParam, likeParam);
    dataParams.push(likeParam, likeParam, likeParam);
  }

  dataQuery += ` ORDER BY pin_code ASC LIMIT ? OFFSET ?`;
  dataParams.push(limit, offset);

  const [[countRow]] = await db.query(countQuery, countParams);
  const [rows]       = await db.query(dataQuery, dataParams);

  return {
    items: rows,
    total: Number(countRow?.total || 0),
    page,
    limit,
  };
}

/**
 * createServiceablePinCode – insert a new pin code.
 */
async function createServiceablePinCode({ pin_code, city, state, is_active = true }) {
  const [result] = await db.query(
    `INSERT INTO serviceable_pin_codes (pin_code, city, state, is_active) VALUES (?, ?, ?, ?)`,
    [pin_code, city || null, state || null, is_active]
  );
  const [rows] = await db.query(
    `SELECT id, pin_code, city, state, is_active, created_at, updated_at FROM serviceable_pin_codes WHERE id = ?`,
    [result.insertId]
  );
  return rows[0];
}

/**
 * updateServiceablePinCode – update a pin code entry.
 */
async function updateServiceablePinCode(pinCodeId, { pin_code, city, state, is_active }) {
  const [result] = await db.query(
    `UPDATE serviceable_pin_codes
     SET pin_code  = COALESCE(?, pin_code),
         city      = COALESCE(?, city),
         state     = COALESCE(?, state),
         is_active = COALESCE(?, is_active),
         updated_at = NOW()
     WHERE id = ?`,
    [pin_code || null, city || null, state || null, is_active !== undefined ? is_active : null, pinCodeId]
  );
  if (result.affectedRows === 0) return null;
  const [rows] = await db.query(
    `SELECT id, pin_code, city, state, is_active, created_at, updated_at FROM serviceable_pin_codes WHERE id = ?`,
    [pinCodeId]
  );
  return rows[0];
}

/**
 * deleteServiceablePinCode – remove a pin code entry.
 */
async function deleteServiceablePinCode(pinCodeId) {
  await db.query(`DELETE FROM serviceable_pin_codes WHERE id = ?`, [pinCodeId]);
}

module.exports = {
  getReports,
  getDashboardStats,
  getPermissions,
  getRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
  getRolePermissions,
  addPermissionToRole,
  removePermissionFromRole,
  getServiceablePinCodes,
  createServiceablePinCode,
  updateServiceablePinCode,
  deleteServiceablePinCode,
};
