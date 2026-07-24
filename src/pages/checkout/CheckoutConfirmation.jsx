import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import packageIcon from '@/assets/icons/package.svg';
import checkIcon from '@/assets/icons/check.svg';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: '48px 16px',
  },
  container: {
    maxWidth: '640px',
    margin: '0 auto',
    textAlign: 'center',
  },
  iconWrap: {
    width: '72px',
    height: '72px',
    borderRadius: '9999px',
    backgroundColor: '#d3f9d8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  icon: {
    width: '36px',
    height: '36px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    marginBottom: '12px',
  },
  subheading: {
    fontSize: '16px',
    fontWeight: '400',
    color: '#495057',
    lineHeight: '24px',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
    textAlign: 'left',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#495057',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    lineHeight: '16px',
    marginBottom: '12px',
  },
  orderIdRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  orderIdLabel: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    backgroundColor: '#e8ecfd',
    borderRadius: '3px',
    padding: '2px 8px',
    lineHeight: '20px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '8px 0',
    borderBottom: '1px solid #dee2e6',
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
  },
  detailRowLast: {
    borderBottom: 'none',
  },
  detailValue: {
    fontWeight: '600',
    color: '#212529',
    textAlign: 'right',
  },
  statusBadge: {
    display: 'inline-block',
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
    borderRadius: '9999px',
    padding: '3px 12px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    paddingBottom: '12px',
    marginBottom: '12px',
    borderBottom: '1px solid #dee2e6',
  },
  itemRowLast: {
    borderBottom: 'none',
    marginBottom: '0',
    paddingBottom: '0',
  },
  itemImg: {
    width: '56px',
    height: '56px',
    objectFit: 'cover',
    borderRadius: '6px',
    backgroundColor: '#e9ecef',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#212529',
    lineHeight: '20px',
    marginBottom: '2px',
  },
  itemMeta: {
    fontSize: '12px',
    color: '#495057',
    lineHeight: '18px',
  },
  itemPrice: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    flexShrink: 0,
  },
  actionsRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '8px',
  },
  primaryBtn: {
    display: 'block',
    width: '100%',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 32px',
    cursor: 'pointer',
    minHeight: '44px',
    textDecoration: 'none',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  secondaryBtn: {
    display: 'block',
    width: '100%',
    fontSize: '15px',
    fontWeight: '500',
    color: '#4c6ef5',
    backgroundColor: 'transparent',
    border: '2px solid #4c6ef5',
    borderRadius: '10px',
    padding: '12px 32px',
    cursor: 'pointer',
    minHeight: '44px',
    textDecoration: 'none',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  guestRegisterCard: {
    backgroundColor: '#e8ecfd',
    borderRadius: '10px',
    padding: '20px 24px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  guestRegisterTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '6px',
  },
  guestRegisterDesc: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    marginBottom: '14px',
  },
  guestRegisterLink: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4c6ef5',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  spinner: {
    textAlign: 'center',
    padding: '48px',
    fontSize: '16px',
    color: '#495057',
  },
  alertError: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
    lineHeight: '20px',
    textAlign: 'left',
  },
};

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);
}

function getAuthToken() {
  try {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  } catch {
    return null;
  }
}

function isGuest() {
  try {
    return !localStorage.getItem('authToken') && !sessionStorage.getItem('authToken');
  } catch {
    return true;
  }
}

export default function CheckoutConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId || '';
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(!!orderId);
  const [apiError, setApiError] = useState('');
  const token = getAuthToken();
  const guest = isGuest();

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      })
        .then((r) => r.json())
        .then((data) => { setOrder(data.data || data); })
        .catch(() => setApiError('Could not load order details.'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId, token]);

  if (loading) return <div style={styles.spinner}>Loading your order…</div>;

  const items = order?.items || [];
  const address = order?.address;
  const total = order?.total || order?.totalAmount;
  const status = order?.status || 'confirmed';
  const createdAt = order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.iconWrap} aria-hidden="true">
          <img src={checkIcon} alt="" style={styles.icon} />
        </div>

        <h1 style={styles.heading}>Order Confirmed!</h1>
        <p style={styles.subheading}>
          Thank you for your purchase. We've received your order and will send you updates by email.
        </p>

        {apiError && <div style={styles.alertError} role="alert">{apiError}</div>}

        <div style={styles.card}>
          <div style={styles.cardTitle}>Order Details</div>
          {orderId && (
            <div style={{ ...styles.detailRow }}>
              <span style={styles.orderIdLabel}>Order ID</span>
              <span style={styles.orderId}>{orderId}</span>
            </div>
          )}
          {createdAt && (
            <div style={styles.detailRow}>
              <span>Date</span>
              <span style={styles.detailValue}>{createdAt}</span>
            </div>
          )}
          <div style={{ ...styles.detailRow, ...((!total) ? styles.detailRowLast : {}) }}>
            <span>Status</span>
            <span><span style={styles.statusBadge}>{status}</span></span>
          </div>
          {total !== undefined && total !== null && (
            <div style={{ ...styles.detailRow, ...styles.detailRowLast }}>
              <span>Total Paid</span>
              <span style={styles.detailValue}>{formatCurrency(total)}</span>
            </div>
          )}
        </div>

        {address && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>Delivery Address</div>
            <div style={{ fontSize: '14px', color: '#495057', lineHeight: '22px' }}>
              <div style={{ fontWeight: '600', color: '#212529', marginBottom: '4px' }}>{address.fullName}</div>
              {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}<br />
              {address.city}, {address.state} - {address.pinCode}<br />
              {address.country}
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>Items Ordered</div>
            {items.map((item, idx) => (
              <div
                key={item.id || item.skuId || idx}
                style={{ ...styles.itemRow, ...(idx === items.length - 1 ? styles.itemRowLast : {}) }}
              >
                <img
                  src={item.imageUrl || '/src/assets/images/placeholder-product.svg'}
                  alt={item.name || 'Product'}
                  style={styles.itemImg}
                />
                <div style={styles.itemInfo}>
                  <div style={styles.itemName}>{item.name || item.productName}</div>
                  {item.variantLabel && <div style={styles.itemMeta}>{item.variantLabel}</div>}
                  <div style={styles.itemMeta}>Qty: {item.quantity}</div>
                </div>
                <div style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
        )}

        {guest && (
          <div style={styles.guestRegisterCard}>
            <div style={styles.guestRegisterTitle}>Save your order history</div>
            <p style={styles.guestRegisterDesc}>
              Create an account to track this order, get faster checkout next time, and manage your purchases.
            </p>
            <Link to="/checkout/register" style={styles.guestRegisterLink}>
              Create an account →
            </Link>
          </div>
        )}

        <div style={styles.actionsRow}>
          {orderId && (
            <Link to={`/orders/${orderId}`} style={styles.primaryBtn}>
              Track My Order
            </Link>
          )}
          <Link to="/" style={styles.secondaryBtn}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
