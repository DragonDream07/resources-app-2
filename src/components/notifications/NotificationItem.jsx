import checkIcon from '@/assets/icons/check.svg';

function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NotificationItem({ notification, onMarkRead }) {
  const { id, message, created_at, read, type } = notification;

  function handleMarkRead() {
    if (!read && onMarkRead) {
      onMarkRead(id);
    }
  }

  return (
    <div
      className={`notification-item${read ? ' notification-item--read' : ' notification-item--unread'}`}
      role="listitem"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-border, #e2e8f0)',
        background: read ? 'transparent' : 'var(--color-unread-bg, #ebf8ff)',
        transition: 'background 0.2s',
      }}
    >
      <div
        className="notification-item__icon"
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--color-primary-light, #bee3f8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
        }}
      >
        {type === 'order' ? '📦' : type === 'promo' ? '🏷️' : type === 'return' ? '↩️' : '🔔'}
      </div>

      <div className="notification-item__body" style={{ flex: 1, minWidth: 0 }}>
        <p
          className="notification-item__message"
          style={{
            margin: 0,
            fontSize: '13px',
            lineHeight: '1.5',
            color: 'var(--color-text, #1a202c)',
            fontWeight: read ? 400 : 600,
            wordBreak: 'break-word',
          }}
        >
          {message}
        </p>
        <span
          className="notification-item__timestamp"
          style={{
            display: 'block',
            marginTop: '4px',
            fontSize: '11px',
            color: 'var(--color-text-muted, #718096)',
          }}
        >
          {formatTimestamp(created_at)}
        </span>
      </div>

      {!read && (
        <button
          className="notification-item__mark-read"
          aria-label="Mark notification as read"
          onClick={handleMarkRead}
          title="Mark as read"
          style={{
            flexShrink: 0,
            background: 'none',
            border: '1px solid var(--color-primary, #3182ce)',
            borderRadius: '4px',
            cursor: 'pointer',
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src={checkIcon} alt="" width={12} height={12} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
