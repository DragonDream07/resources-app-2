import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

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
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  backLink: {
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '16px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    margin: '0 0 8px 0',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    lineHeight: '28px',
    margin: '0 0 16px 0',
  },
  orderIdLabel: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    color: '#495057',
  },
  timelineList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  timelineItem: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: '12px',
    height: '12px',
    borderRadius: '9999px',
    backgroundColor: '#4c6ef5',
    marginTop: '4px',
    flexShrink: 0,
  },
  timelineContent: {
    flex: 1,
  },
  timelineStatus: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    textTransform: 'capitalize',
  },
  timelineDate: {
    fontSize: '12px',
    color: '#495057',
    marginTop: '2px',
  },
  itemRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #e9ecef',
  },
  itemImg: {
    width: '56px',
    height: '56px',
    objectFit: 'cover',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 4px 0',
  },
  itemMeta: {
    fontSize: '12px',
    color: '#495057',
    margin: 0,
  },
  itemPrice: {
    marginLeft: 'auto',
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
  },
  trackingInfo: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
  },
  trackingId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    color: '#212529',
  },
  actionRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  btnDanger: {
    backgroundColor: 'transparent',
    color: '#f03e3e',
    border: '1px solid #f03e3e',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  btnPrimary: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  skeleton: {
    height: '120px',
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    marginBottom: '24px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#495057',
    padding: '6px 0',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: '700',
    color: '#212529',
    padding: '12px 0 0 0',
    borderTop: '1px solid #e9ecef',
    marginTop: '6px',
  },
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  async function loadOrder() {
    setLoading(true);
    setError('');
    try {
      const [orderRes, timelineRes, trackingRes] = await Promise.all([
        fetch(`/orders/${id}`, { credentials: 'include' }),
        fetch(`/orders/${id}/timeline`, { credentials: 'include' }),
        fetch(`/orders/${id}/tracking`, { credentials: 'include' }),
      ]);
      if (!orderRes.ok) throw new Error('Order not found or you do not have permission to view it.');
      const orderData = await orderRes.json();
      setOrder(orderData.data || orderData);
      if (timelineRes.ok) {
        const tlData = await timelineRes.json();
        setTimeline(Array.isArray(tlData.data) ? tlData.data : Array.isArray(tlData) ? tlData : []);
      }
      if (trackingRes.ok) {
        const trData = await trackingRes.json();
        setTracking(trData.data || trData);
      }
    } catch (err) {
      setError(err.message || 'Failed to load order.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadOrder(); }, [id]);

  async function handleCancel() {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelError('');
    setCancelling(true);
    try {
      const res = await fetch(`/orders/${id}/cancel`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to cancel order.');
      }
      loadOrder();
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.skeleton} />
          <div style={styles.skeleton} />
          <div style={styles.skeleton} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorBanner}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>{error}</p>
            <Link to="/account/orders" style={{ color: '#f03e3e', fontSize: '14px' }}>← Back to order history</Link>
          </div>
        </div>
      </div>
    );
  }

  const canCancel = order && ['pending', 'confirmed'].includes(order.status);
  const canReturn = order && order.status === 'delivered';
  const items = order?.items || [];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); navigate('/account/orders'); }}
          style={styles.backLink}
        >
          ← Back to order history
        </a>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          <div>
            <h1 style={styles.pageTitle}>Order detail</h1>
            <span style={styles.orderIdLabel}>#{order?.id}</span>
          </div>
          <StatusBadge status={order?.status} />
        </div>

        {cancelError && <div style={styles.errorBanner}>{cancelError}</div>}

        {/* Timeline */}
        {timeline.length > 0 && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Order timeline</h2>
            <ul style={styles.timelineList}>
              {timeline.map((event, idx) => (
                <li key={idx} style={styles.timelineItem}>
                  <div style={styles.timelineDot} />
                  <div style={styles.timelineContent}>
                    <div style={styles.timelineStatus}>{event.status}</div>
                    {event.created_at && (
                      <div style={styles.timelineDate}>
                        {new Date(event.created_at).toLocaleString()}
                      </div>
                    )}
                    {event.note && <div style={{ fontSize: '13px', color: '#495057', marginTop: '2px' }}>{event.note}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Items */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Items</h2>
          {items.map((item, idx) => (
            <div key={item.id || idx} style={{ ...styles.itemRow, ...(idx === items.length - 1 ? { borderBottom: 'none' } : {}) }}>
              <img
                src={item.image_url || '/src/assets/images/placeholder-product.svg'}
                alt={item.name || 'Product'}
                style={styles.itemImg}
              />
              <div style={{ flex: 1 }}>
                <p style={styles.itemName}>{item.name || item.product_name}</p>
                <p style={styles.itemMeta}>Qty: {item.quantity}</p>
                {item.sku && <p style={{ ...styles.itemMeta, fontFamily: "'JetBrains Mono', monospace" }}>SKU: {item.sku}</p>}
              </div>
              <div style={styles.itemPrice}>
                ${typeof item.unit_price === 'number' ? item.unit_price.toFixed(2) : item.unit_price}
              </div>
            </div>
          ))}
          <div style={{ marginTop: '16px' }}>
            {order?.subtotal != null && (
              <div style={styles.summaryRow}><span>Subtotal</span><span>${typeof order.subtotal === 'number' ? order.subtotal.toFixed(2) : order.subtotal}</span></div>
            )}
            {order?.shipping_cost != null && (
              <div style={styles.summaryRow}><span>Shipping</span><span>${typeof order.shipping_cost === 'number' ? order.shipping_cost.toFixed(2) : order.shipping_cost}</span></div>
            )}
            {order?.discount != null && order.discount > 0 && (
              <div style={styles.summaryRow}><span>Discount</span><span style={{ color: '#37b24d' }}>-${typeof order.discount === 'number' ? order.discount.toFixed(2) : order.discount}</span></div>
            )}
            {order?.total != null && (
              <div style={styles.summaryTotal}><span>Total</span><span>${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}</span></div>
            )}
          </div>
        </div>

        {/* Tracking */}
        {tracking && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Tracking</h2>
            <div style={styles.trackingInfo}>
              {tracking.carrier && <p style={{ margin: '0 0 4px 0' }}>Carrier: <strong>{tracking.carrier}</strong></p>}
              {tracking.tracking_number && (
                <p style={{ margin: '0 0 4px 0' }}>
                  Tracking number: <span style={styles.trackingId}>{tracking.tracking_number}</span>
                </p>
              )}
              {tracking.status && <p style={{ margin: '0 0 4px 0' }}>Status: {tracking.status}</p>}
              {tracking.estimated_delivery && (
                <p style={{ margin: 0 }}>Estimated delivery: {new Date(tracking.estimated_delivery).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {(canCancel || canReturn) && (
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Actions</h2>
            <div style={styles.actionRow}>
              {canReturn && (
                <Link to={`/account/orders/${id}/return`} style={styles.btnPrimary}>
                  Request a return
                </Link>
              )}
              {canCancel && (
                <button style={styles.btnDanger} onClick={handleCancel} disabled={cancelling}>
                  {cancelling ? 'Cancelling…' : 'Cancel order'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
