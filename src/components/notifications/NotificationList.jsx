import NotificationItem from './NotificationItem';

export default function NotificationList({ notifications = [], onMarkRead }) {
  return (
    <div
      className="notification-list"
      role="list"
      style={{
        maxHeight: '400px',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {notifications.length === 0 ? (
        <div
          className="notification-list__empty"
          style={{
            padding: '32px 16px',
            textAlign: 'center',
            color: 'var(--color-text-muted, #718096)',
            fontSize: '14px',
          }}
        >
          No notifications yet.
        </div>
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkRead={onMarkRead}
          />
        ))
      )}
    </div>
  );
}
