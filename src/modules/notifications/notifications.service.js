const { getDb } = require('../../config/db');

async function createNotification({ userId, type, title, body, metadata = {} }) {
  const db = getDb();
  const result = await db.query(
    `INSERT INTO notifications (user_id, type, title, body, metadata, is_read, created_at)
     VALUES ($1, $2, $3, $4, $5, false, NOW())
     RETURNING *`,
    [userId, type, title, body, JSON.stringify(metadata)]
  );
  return result.rows[0];
}

async function getNotifications(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
  const db = getDb();
  const offset = (page - 1) * limit;

  const conditions = ['user_id = $1'];
  const params = [userId];
  let paramIndex = 2;

  if (unreadOnly) {
    conditions.push(`is_read = false`);
  }

  const whereClause = conditions.map((c) => c).join(' AND ');

  const countResult = await db.query(
    `SELECT COUNT(*) FROM notifications WHERE ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count, 10);

  const dataResult = await db.query(
    `SELECT * FROM notifications WHERE ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, limit, offset]
  );

  const unreadCountResult = await db.query(
    `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false`,
    [userId]
  );
  const unreadCount = parseInt(unreadCountResult.rows[0].count, 10);

  return {
    data: dataResult.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    unreadCount,
  };
}

async function getNotificationById(userId, notificationId) {
  const db = getDb();
  const result = await db.query(
    `SELECT * FROM notifications WHERE id = $1 AND user_id = $2`,
    [notificationId, userId]
  );
  return result.rows[0] || null;
}

async function markNotificationRead(userId, notificationId) {
  const db = getDb();
  const result = await db.query(
    `UPDATE notifications
     SET is_read = true, read_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [notificationId, userId]
  );
  return result.rows[0] || null;
}

async function markAllNotificationsRead(userId) {
  const db = getDb();
  const result = await db.query(
    `UPDATE notifications
     SET is_read = true, read_at = NOW()
     WHERE user_id = $1 AND is_read = false
     RETURNING *`,
    [userId]
  );
  return {
    updated: result.rowCount,
    notifications: result.rows,
  };
}

async function getUnreadCount(userId) {
  const db = getDb();
  const result = await db.query(
    `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false`,
    [userId]
  );
  return parseInt(result.rows[0].count, 10);
}

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadCount,
};
