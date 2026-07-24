import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '8px',
  },
  h2: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    lineHeight: '28px',
    margin: '0 0 8px 0',
  },
  muted: {
    color: '#495057',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 0 16px 0',
  },
  tilesRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '32px',
  },
  tile: {
    flex: '1',
    minWidth: '140px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #e9ecef',
    transition: 'box-shadow 0.15s',
    textDecoration: 'none',
  },
  tileSectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
  },
  tileText: {
    fontSize: '14px',
    color: '#495057',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navItem: {
    borderBottom: '1px solid #868e96',
  },
  navButton: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    background: 'none',
    border: 'none',
    borderRadius: '0',
    padding: '16px 20px',
    fontSize: '16px',
    color: '#4c6ef5',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    textAlign: 'left',
  },
  profileName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    lineHeight: '32px',
    margin: '0 0 4px 0',
  },
  profileEmail: {
    fontSize: '14px',
    color: '#495057',
    margin: 0,
  },
  avatarCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '9999px',
    backgroundColor: '#e8ecfd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
    color: '#4c6ef5',
    marginBottom: '16px',
  },
  editLink: {
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    marginTop: '8px',
    display: 'inline-block',
  },
  unreadBadge: {
    display: 'inline-block',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '600',
    padding: '2px 8px',
    marginTop: '4px',
  },
};

export default function AccountOverview() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [meRes, notifRes] = await Promise.all([
          fetch('/users/me', { credentials: 'include' }),
          fetch('/notifications', { credentials: 'include' }),
        ]);
        if (meRes.ok) {
          const meData = await meRes.json();
          setUser(meData);
        }
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          const unread = Array.isArray(notifData.data)
            ? notifData.data.filter((n) => !n.read).length
            : 0;
          setUnreadCount(unread);
        }
      } catch (_) {
        // silently ignore
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const initials = user
    ? `${user.first_name ? user.first_name[0] : ''}${user.last_name ? user.last_name[0] : ''}`.toUpperCase()
    : '?';

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.card, animation: 'pulse 1.5s infinite' }}>
            <div style={{ height: '24px', backgroundColor: '#e9ecef', borderRadius: '6px', marginBottom: '12px', width: '40%' }} />
            <div style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '6px', width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>My Account</h1>

        {/* Profile summary card */}
        <div style={styles.card}>
          <div style={styles.avatarCircle}>{initials}</div>
          <p style={styles.profileName}>
            {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Account' : 'Account'}
          </p>
          <p style={styles.profileEmail}>{user?.email || ''}</p>
          <p style={styles.muted}>
            Save your details for faster checkout and access your full order history anytime.
          </p>
          <Link to="/account/profile" style={styles.editLink}>
            Edit profile →
          </Link>
        </div>

        {/* Quick links tiles */}
        <div style={styles.tilesRow}>
          <div
            style={styles.tile}
            role="button"
            tabIndex={0}
            onClick={() => navigate('/account/orders')}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/account/orders')}
          >
            <span style={styles.tileSectionLabel}>Orders</span>
            <span style={styles.tileText}>Track your orders and view order history</span>
          </div>

          <div
            style={styles.tile}
            role="button"
            tabIndex={0}
            onClick={() => navigate('/account/addresses')}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/account/addresses')}
          >
            <span style={styles.tileSectionLabel}>Addresses</span>
            <span style={styles.tileText}>Manage your delivery addresses</span>
          </div>

          <div
            style={styles.tile}
            role="button"
            tabIndex={0}
            onClick={() => navigate('/account/notifications')}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/account/notifications')}
          >
            <span style={styles.tileSectionLabel}>Notifications</span>
            <p style={{ ...styles.tileText, margin: 0 }}>Unread notifications</p>
            {unreadCount > 0 && (
              <span style={styles.unreadBadge}>{unreadCount}</span>
            )}
          </div>
        </div>

        {/* Navigation list */}
        <div style={styles.card}>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <button style={styles.navButton} onClick={() => navigate('/account/profile')}>
                Order history
              </button>
            </li>
            <li style={styles.navItem}>
              <button style={styles.navButton} onClick={() => navigate('/account/addresses')}>
                Addresses
              </button>
            </li>
            <li style={styles.navItem}>
              <button
                style={{ ...styles.navButton, justifyContent: 'flex-start' }}
                onClick={() => navigate('/account/notifications')}
              >
                Notifications
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
