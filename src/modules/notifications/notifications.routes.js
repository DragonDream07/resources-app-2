const express = require('express');
const router = express.Router();
const notificationsController = require('./notifications.controller');
const { authenticate } = require('../../middleware/auth.middleware');

router.get('/', authenticate, notificationsController.getNotifications);
router.get('/:notificationId', authenticate, notificationsController.getNotification);
router.post('/read-all', authenticate, notificationsController.markAllRead);
router.post('/:notificationId/read', authenticate, notificationsController.markRead);

module.exports = router;
