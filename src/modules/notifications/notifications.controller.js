const notificationsService = require('./notifications.service');

async function getNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const { page, limit, unread_only } = req.query;
    const result = await notificationsService.getNotifications(userId, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      unreadOnly: unread_only === 'true',
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function getNotification(req, res, next) {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;
    const notification = await notificationsService.getNotificationById(userId, notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;
    const notification = await notificationsService.markNotificationRead(userId, notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (err) {
    next(err);
  }
}

async function markAllRead(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await notificationsService.markAllNotificationsRead(userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNotifications,
  getNotification,
  markRead,
  markAllRead,
};
