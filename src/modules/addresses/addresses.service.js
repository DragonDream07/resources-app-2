const db = require('../../config/db');

const getAddresses = async (userId) => {
  const result = await db.query(
    'SELECT * FROM addresses WHERE user_id = $1 AND deleted_at IS NULL ORDER BY is_default DESC, created_at DESC',
    [userId]
  );
  return result.rows;
};

const getAddress = async (userId, addressId) => {
  const result = await db.query(
    'SELECT * FROM addresses WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
    [addressId, userId]
  );
  if (result.rows.length === 0) {
    const error = new Error('Address not found.');
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
};

const checkServiceability = async (pinCode) => {
  const result = await db.query(
    'SELECT id FROM serviceable_pin_codes WHERE pin_code = $1',
    [pinCode]
  );
  return result.rows.length > 0;
};

const unsetDefaultAddress = async (userId, client) => {
  await (client || db).query(
    'UPDATE addresses SET is_default = false WHERE user_id = $1 AND deleted_at IS NULL',
    [userId]
  );
};

const createAddress = async (userId, payload) => {
  const {
    full_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    pin_code,
    country,
    is_default,
    address_type,
  } = payload;

  const isServiceable = await checkServiceability(pin_code);
  if (!isServiceable) {
    const error = new Error('The provided PIN code is not serviceable.');
    error.statusCode = 422;
    throw error;
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    if (is_default) {
      await unsetDefaultAddress(userId, client);
    } else {
      const existing = await client.query(
        'SELECT id FROM addresses WHERE user_id = $1 AND deleted_at IS NULL LIMIT 1',
        [userId]
      );
      if (existing.rows.length === 0) {
        payload.is_default = true;
      }
    }

    const result = await client.query(
      `INSERT INTO addresses
        (user_id, full_name, phone, address_line1, address_line2, city, state, pin_code, country, is_default, address_type, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
       RETURNING *`,
      [
        userId,
        full_name,
        phone,
        address_line1,
        address_line2 || null,
        city,
        state,
        pin_code,
        country,
        payload.is_default || false,
        address_type || 'home',
      ]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const updateAddress = async (userId, addressId, payload) => {
  const existing = await getAddress(userId, addressId);
  if (!existing) {
    const error = new Error('Address not found.');
    error.statusCode = 404;
    throw error;
  }

  const {
    full_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    pin_code,
    country,
    is_default,
    address_type,
  } = payload;

  if (pin_code) {
    const isServiceable = await checkServiceability(pin_code);
    if (!isServiceable) {
      const error = new Error('The provided PIN code is not serviceable.');
      error.statusCode = 422;
      throw error;
    }
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    if (is_default) {
      await unsetDefaultAddress(userId, client);
    }

    const result = await client.query(
      `UPDATE addresses SET
        full_name     = COALESCE($1, full_name),
        phone         = COALESCE($2, phone),
        address_line1 = COALESCE($3, address_line1),
        address_line2 = COALESCE($4, address_line2),
        city          = COALESCE($5, city),
        state         = COALESCE($6, state),
        pin_code      = COALESCE($7, pin_code),
        country       = COALESCE($8, country),
        is_default    = COALESCE($9, is_default),
        address_type  = COALESCE($10, address_type),
        updated_at    = NOW()
       WHERE id = $11 AND user_id = $12 AND deleted_at IS NULL
       RETURNING *`,
      [
        full_name || null,
        phone || null,
        address_line1 || null,
        address_line2 !== undefined ? address_line2 : null,
        city || null,
        state || null,
        pin_code || null,
        country || null,
        is_default !== undefined ? is_default : null,
        address_type || null,
        addressId,
        userId,
      ]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const deleteAddress = async (userId, addressId) => {
  const existing = await getAddress(userId, addressId);
  if (!existing) {
    const error = new Error('Address not found.');
    error.statusCode = 404;
    throw error;
  }

  await db.query(
    'UPDATE addresses SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND user_id = $2',
    [addressId, userId]
  );

  if (existing.is_default) {
    const next = await db.query(
      'SELECT id FROM addresses WHERE user_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    if (next.rows.length > 0) {
      await db.query(
        'UPDATE addresses SET is_default = true WHERE id = $1',
        [next.rows[0].id]
      );
    }
  }
};

module.exports = {
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  checkServiceability,
};
