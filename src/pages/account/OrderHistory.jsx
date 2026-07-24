import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const STATUS_BADGE = {
  pending: { bg: '#fff4e6', color: '#fd7e14', label: 'Pending' },
  confirmed: { bg: '#e8ecfd', color: '#4c6ef5', label: 'Confirmed' },
  processing: { bg: '#e8ecfd', color: '#4c6ef5', label: 'Processing' },
  shipped: { bg: '#e8ecfd', color: '#4c6ef5', label: 'Shipped' },
  delivered: { bg: '#d3f9d8', color: '#37b24d', label: 'Delivered' },
  cancelled: { bg: '#ffe3e3', color: '#f03e3e', label: 'Cancelled' },
  return_requested: { bg: '#fff4e6', color: '#fd7e14', label: '↩️ Return requested' },
  returned: { bg: '#d3f9d8', color: '#37b24d', label: 'Returned' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_BADGE[status] || { bg: '#e9ecef', color: '#495057', label: status };
  return (
    <span style={{
      display: 'inline-block',
      backgroundColor: cfg.bg,
      color: cfg.color,
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      padding: '3px 12px',
    }}>
      {cfg.label}
    </span>
  );
}

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
  backLink: {
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '16px',
    cursor: 'pointer',
    borderLeft: '4px solid transparent',
    transition: 'box-shadow 0.15s',
  },
  orderIdRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    color: '#212529',
    fontWeight: '400',
  },
  orderDate: {
    fontSize: '14px',
    color: '#495057',
  },
  orderMeta: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '8px',
    fontSize: '14px',
    color: '#495057',
  },
  viewLink: {
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    fontWeight: '600',
    marginTop: '12px',
    display: 'inline-block',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px',
    color: '#495057',
    fontSize: '16px',
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
  notifBtn: {
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: 'none',
    padding: 0,
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  skeleton: {
    height: '100px',
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    marginBottom: '16px',
  },
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadOrders() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/orders', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load orders.');
      const data = await res.json();
      setOrders(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadOrders(); }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/account" style={styles.backLink}>← Back to account</Link>
        <div style={styles.headerRow}>
          <h1 style={styles.pageTitle}>Order history</h1>
          <button style={styles.notifBtn} onClick={() => navigate('/account/notifications')}>
            Notifications
          </button>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <span>{error}</span>
            <button
              style={{ ...styles.notifBtn, color: '#f03e3e', fontWeight: '600' }}
              onClick={loadOrders}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <>
            <div style={styles.skeleton} />
            <div style={styles.skeleton} />
            <div style={styles.skeleton} />
          </>
        ) : orders.length === 0 ? (
          <div style={styles.emptyState}>
            <img src="/src/assets/images/empty-state.svg" alt="" style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>You have no orders yet.</p>
            <Link to="/" style={{ color: '#4c6ef5' }}>Browse products</Link>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              style={styles.card}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/account/orders/${order.id}`)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/account/orders/${order.id}`)}
            >
              <div style={styles.orderIdRow}>
                <span style={styles.orderId}>#{order.id}</span>
                <StatusBadge status={order.status} />
              </div>
              <div style={styles.orderDate}>
                {order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
              </div>
              <div style={styles.orderMeta}>
                <span>{order.item_count || (order.items ? order.items.length : 0)} item(s)</span>
                {order.total != null && (
                  <span style={{ fontWeight: '600', color: '#212529' }}>
                    ${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}
                  </span>
                )}
              </div>
              <Link
                to={`/account/orders/${order.id}`}
                style={styles.viewLink}
                onClick={(e) => e.stopPropagation()}
              >
                View order →
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
