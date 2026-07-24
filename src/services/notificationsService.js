import api from './api';

const notificationsService = {
  listNotifications: (params) =>
    api.get('/notifications', { params }).then((res) => res.data),

  markAsRead: (notificationId) =>
    api.post(`/notifications/${notificationId}/read`).then((res) => res.data),

  markAllAsRead: () =>
    api.post('/notifications/read-all').then((res) => res.data),
};

export default notificationsService;
