import { useState, useRef, useEffect } from 'react';
import bellIcon from '@/assets/icons/bell.svg';
import NotificationList from './NotificationList';

export default function NotificationBell({ notifications = [], onMarkRead, onMarkAllRead }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="notification-bell" ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="notification-bell__trigger"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={bellIcon} alt="" width={24} height={24} aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className="notification-bell__badge"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              background: 'var(--color-error, #e53e3e)',
              color: '#fff',
              borderRadius: '9999px',
              fontSize: '10px',
              fontWeight: 700,
              minWidth: '16px',
              height: '16px',
              lineHeight: '16px',
              textAlign: 'center',
              padding: '0 3px',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="notification-bell__dropdown"
          role="dialog"
          aria-label="Notifications"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 1000,
            background: 'var(--color-surface, #fff)',
            border: '1px solid var(--color-border, #e2e8f0)',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            width: '360px',
            maxWidth: '95vw',
          }}
        >
          <div
            className="notification-bell__dropdown-header"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid var(--color-border, #e2e8f0)',
            }}
          >
            <span style={{ fontWeight: 600, fontSize: '14px' }}>Notifications</span>
            {unreadCount > 0 && (
              <button
                className="notification-bell__mark-all"
                onClick={() => {
                  onMarkAllRead && onMarkAllRead();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-primary, #3182ce)',
                  fontSize: '12px',
                  fontWeight: 500,
                  padding: 0,
                }}
              >
                Mark all as read
              </button>
            )}
          </div>
          <NotificationList
            notifications={notifications}
            onMarkRead={onMarkRead}
          />
        </div>
      )}
    </div>
  );
}
