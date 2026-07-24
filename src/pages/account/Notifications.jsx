import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    margin: 0,
  },
  btnGhost: {
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    padding: '8px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  notifCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '16px 20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '12px',
    cursor: 'pointer',
    position: 'relative',
    borderLeft: '4px solid transparent',
    transition: 'box-shadow 0.15s',
  },
  notifCardUnread: {
    borderLeft: '4px solid #4c6ef5',
    backgroundColor: '#f0f4ff',
  },
  notifTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 4px 0',
    lineHeight: '24px',
  },
  notifBody: {
    fontSize: '16px',
    color: '#212529',
    lineHeight: '1.625',
    margin: 0,
  },
  notifDate: {
    fontSize: '12px',
    color: '#495057',
    marginTop: '8px',
  },
  unreadDot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '9999px',
    backgroundColor: '#4c6ef5',
    marginRight: '8px',
    verticalAlign: 'middle',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '20px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px',
    color: '#495057',
    fontSize: '16px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  skeleton: {
    height: '80px',
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    marginBottom: '12px',
  },
  backLink: {
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '16px',
  },
  retryBtn: {
    backgroundColor: 'transparent',
    color: '#f03e3e',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingAll, setMarkingAll] = useState(false);

  async function loadNotifications() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/notifications', { credentials: 'include' });
      if (!res.ok) throw new Error('Unable to load notifications. Please try again.');
      const data = await res.json();
      setNotifications(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Unable to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadNotifications(); }, []);

  async function handleMarkAllRead() {
    setMarkingAll(true);
    try {
      const res = await fetch('/notifications/read-all', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to mark all as read.');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (_) {
      // silently ignore
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleMarkRead(notificationId) {
    try {
      await fetch(`/notifications/${notificationId}/read`, {
        method: 'POST',
        credentials: 'include',
      });
      setNotifications((prev) =>
        prev.map((n) => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (_) {
      // silently ignore
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/account" style={styles.backLink}>← Back to account</Link>
        <div style={styles.headerRow}>
          <h1 style={styles.pageTitle}>Notifications</h1>
          {notifications.some((n) => !n.read) && (
            <button
              style={styles.btnGhost}
              onClick={handleMarkAllRead}
              disabled={markingAll}
            >
              {markingAll ? 'Marking…' : 'Mark all as read'}
            </button>
          )}
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <span>⚠ {error}</span>
            <button style={styles.retryBtn} onClick={loadNotifications}>Retry</button>
          </div>
        )}

        {loading ? (
          <>
            <div style={styles.skeleton} />
            <div style={styles.skeleton} />
            <div style={styles.skeleton} />
          </>
        ) : notifications.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔔</div>
            <p style={{ margin: '0 0 16px 0' }}>You're all caught up — no notifications yet</p>
            <Link to="/" style={{ color: '#4c6ef5', textDecoration: 'none', fontWeight: '600' }}>Browse products</Link>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              style={{
                ...styles.notifCard,
                ...(notif.read ? {} : styles.notifCardUnread),
              }}
              role="button"
              tabIndex={0}
              onClick={() => !notif.read && handleMarkRead(notif.id)}
              onKeyDown={(e) => e.key === 'Enter' && !notif.read && handleMarkRead(notif.id)}
              aria-label={notif.read ? notif.title : `Unread: ${notif.title}`}
            >
              {!notif.read && <span style={styles.unreadDot} aria-hidden="true" />}
              {notif.title && <p style={styles.notifTitle}>{notif.title}</p>}
              <p style={styles.notifBody}>{notif.message || notif.body}</p>
              {notif.created_at && (
                <p style={styles.notifDate}>
                  {new Date(notif.created_at).toLocaleString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
