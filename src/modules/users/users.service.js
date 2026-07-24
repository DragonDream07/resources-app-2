const db = require('../../db');
const bcrypt = require('bcrypt');
const { NotFoundError, UnauthorizedError, ConflictError } = require('../../utils/errors');

const SALT_ROUNDS = 12;

const getUserById = async (userId) => {
  const result = await db.query(
    `SELECT id, email, first_name, last_name, phone, role, is_active, created_at, updated_at
     FROM users
     WHERE id = $1 AND deleted_at IS NULL`,
    [userId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('User not found.');
  }
  return result.rows[0];
};

const updateProfile = async (userId, payload) => {
  const { first_name, last_name, phone } = payload;
  const result = await db.query(
    `UPDATE users
     SET first_name = COALESCE($1, first_name),
         last_name  = COALESCE($2, last_name),
         phone      = COALESCE($3, phone),
         updated_at = NOW()
     WHERE id = $4 AND deleted_at IS NULL
     RETURNING id, email, first_name, last_name, phone, role, is_active, created_at, updated_at`,
    [first_name, last_name, phone, userId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('User not found.');
  }
  return result.rows[0];
};

const changePassword = async (userId, payload) => {
  const { current_password, new_password } = payload;
  const userResult = await db.query(
    'SELECT id, password_hash FROM users WHERE id = $1 AND deleted_at IS NULL',
    [userId]
  );
  if (!userResult.rows.length) {
    throw new NotFoundError('User not found.');
  }
  const user = userResult.rows[0];
  const isMatch = await bcrypt.compare(current_password, user.password_hash);
  if (!isMatch) {
    throw new UnauthorizedError('Current password is incorrect.');
  }
  const newHash = await bcrypt.hash(new_password, SALT_ROUNDS);
  await db.query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [newHash, userId]
  );
};

const getAddresses = async (userId) => {
  const result = await db.query(
    `SELECT id, label, recipient_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default
     FROM user_addresses
     WHERE user_id = $1 AND deleted_at IS NULL
     ORDER BY is_default DESC, created_at DESC`,
    [userId]
  );
  return result.rows;
};

const createAddress = async (userId, payload) => {
  const { label, recipient_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default } = payload;
  if (is_default) {
    await db.query(
      'UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1',
      [userId]
    );
  }
  const result = await db.query(
    `INSERT INTO user_addresses (user_id, label, recipient_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id, label, recipient_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default`,
    [userId, label, recipient_name, phone, address_line1, address_line2 || null, city, state, postal_code, country, is_default || false]
  );
  return result.rows[0];
};

const getAddressById = async (userId, addressId) => {
  const result = await db.query(
    `SELECT id, label, recipient_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default
     FROM user_addresses
     WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
    [addressId, userId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('Address not found.');
  }
  return result.rows[0];
};

const updateAddress = async (userId, addressId, payload) => {
  const existing = await getAddressById(userId, addressId);
  if (!existing) {
    throw new NotFoundError('Address not found.');
  }
  const { label, recipient_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default } = payload;
  if (is_default) {
    await db.query(
      'UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1',
      [userId]
    );
  }
  const result = await db.query(
    `UPDATE user_addresses
     SET label          = COALESCE($1, label),
         recipient_name = COALESCE($2, recipient_name),
         phone          = COALESCE($3, phone),
         address_line1  = COALESCE($4, address_line1),
         address_line2  = $5,
         city           = COALESCE($6, city),
         state          = COALESCE($7, state),
         postal_code    = COALESCE($8, postal_code),
         country        = COALESCE($9, country),
         is_default     = COALESCE($10, is_default),
         updated_at     = NOW()
     WHERE id = $11 AND user_id = $12 AND deleted_at IS NULL
     RETURNING id, label, recipient_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default`,
    [label, recipient_name, phone, address_line1, address_line2 !== undefined ? address_line2 : existing.address_line2, city, state, postal_code, country, is_default, addressId, userId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('Address not found.');
  }
  return result.rows[0];
};

const deleteAddress = async (userId, addressId) => {
  const result = await db.query(
    `UPDATE user_addresses SET deleted_at = NOW() WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL RETURNING id`,
    [addressId, userId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('Address not found.');
  }
};

const listUsers = async ({ page = 1, limit = 20, search, role } = {}) => {
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const params = [];
  const conditions = ['deleted_at IS NULL'];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(email ILIKE $${params.length} OR first_name ILIKE $${params.length} OR last_name ILIKE $${params.length})`);
  }
  if (role) {
    params.push(role);
    conditions.push(`role = $${params.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await db.query(
    `SELECT COUNT(*) FROM users ${whereClause}`,
    params
  );

  params.push(parseInt(limit));
  params.push(offset);

  const usersResult = await db.query(
    `SELECT id, email, first_name, last_name, phone, role, is_active, created_at, updated_at
     FROM users
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return {
    users: usersResult.rows,
    total: parseInt(countResult.rows[0].count),
    page: parseInt(page),
    limit: parseInt(limit),
  };
};

const adminUpdateUser = async (userId, payload) => {
  const { first_name, last_name, phone, role, is_active } = payload;
  const result = await db.query(
    `UPDATE users
     SET first_name = COALESCE($1, first_name),
         last_name  = COALESCE($2, last_name),
         phone      = COALESCE($3, phone),
         role       = COALESCE($4, role),
         is_active  = COALESCE($5, is_active),
         updated_at = NOW()
     WHERE id = $6 AND deleted_at IS NULL
     RETURNING id, email, first_name, last_name, phone, role, is_active, created_at, updated_at`,
    [first_name, last_name, phone, role, is_active, userId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('User not found.');
  }
  return result.rows[0];
};

const deleteUser = async (userId) => {
  const result = await db.query(
    `UPDATE users SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
    [userId]
  );
  if (!result.rows.length) {
    throw new NotFoundError('User not found.');
  }
};

module.exports = {
  getUserById,
  updateProfile,
  changePassword,
  getAddresses,
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
  listUsers,
  adminUpdateUser,
  deleteUser,
};
