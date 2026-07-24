import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: '32px 16px',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '32px',
    gap: '8px',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '400',
    color: '#495057',
  },
  stepActive: {
    fontWeight: '600',
    color: '#4c6ef5',
  },
  stepDone: {
    color: '#37b24d',
    fontWeight: '500',
  },
  stepCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '9999px',
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
  },
  stepCircleActive: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
  },
  stepCircleDone: {
    backgroundColor: '#37b24d',
    color: '#ffffff',
  },
  stepDivider: {
    width: '32px',
    height: '2px',
    backgroundColor: '#868e96',
    borderRadius: '1px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '16px',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    paddingBottom: '16px',
    marginBottom: '16px',
    borderBottom: '1px solid #dee2e6',
  },
  itemRowLast: {
    borderBottom: 'none',
    marginBottom: '0',
    paddingBottom: '0',
  },
  itemImg: {
    width: '72px',
    height: '72px',
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
    fontSize: '15px',
    fontWeight: '500',
    color: '#212529',
    marginBottom: '4px',
    lineHeight: '22px',
  },
  itemMeta: {
    fontSize: '13px',
    color: '#495057',
    lineHeight: '20px',
  },
  itemPrice: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#212529',
    flexShrink: 0,
  },
  totalsTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  totalsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #dee2e6',
  },
  totalsRowLast: {
    borderBottom: 'none',
    fontWeight: '700',
    fontSize: '17px',
    padding: '12px 0 0',
  },
  totalsLabel: {
    fontSize: '14px',
    color: '#495057',
  },
  totalsValue: {
    fontSize: '14px',
    color: '#212529',
    fontWeight: '500',
  },
  freeShipping: {
    color: '#37b24d',
    fontWeight: '600',
  },
  discount: {
    color: '#37b24d',
  },
  promoRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    marginTop: '4px',
  },
  promoInput: {
    flex: 1,
    fontSize: '15px',
    fontWeight: '400',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '10px 12px',
    outline: 'none',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    letterSpacing: '0.04em',
    boxSizing: 'border-box',
  },
  promoInputError: {
    borderColor: '#f03e3e',
  },
  promoBtn: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    cursor: 'pointer',
    minHeight: '44px',
    flexShrink: 0,
  },
  promoBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  promoSuccess: {
    fontSize: '13px',
    color: '#37b24d',
    fontWeight: '500',
    marginTop: '4px',
  },
  promoError: {
    fontSize: '13px',
    color: '#f03e3e',
    marginTop: '4px',
  },
  removePromoBtn: {
    fontSize: '12px',
    color: '#f03e3e',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0 0 0 8px',
    textDecoration: 'underline',
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '24px',
  },
  backBtn: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4c6ef5',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    textDecoration: 'underline',
    minHeight: '44px',
  },
  placeOrderBtn: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 32px',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'background-color 0.15s',
  },
  placeOrderBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  alertError: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
    lineHeight: '20px',
  },
  spinner: {
    textAlign: 'center',
    padding: '48px',
    fontSize: '16px',
    color: '#495057',
  },
  addressMeta: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '22px',
  },
  addressName: {
    fontWeight: '600',
    color: '#212529',
    fontSize: '15px',
    marginBottom: '4px',
  },
  paymentMethodBadge: {
    display: 'inline-block',
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
    borderRadius: '3px',
    padding: '2px 8px',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.04em',
  },
};

const STEP_LABELS = ['Address', 'Payment', 'Review'];

function StepIndicator({ current }) {
  return (
    <div style={styles.stepIndicator}>
      {STEP_LABELS.map((label, idx) => (
        <>
          <div key={label} style={styles.stepItem}>
            <div
              style={{
                ...styles.stepCircle,
                ...(idx < current - 1 ? styles.stepCircleDone : {}),
                ...(idx === current - 1 ? styles.stepCircleActive : {}),
              }}
            >
              {idx < current - 1 ? '✓' : idx + 1}
            </div>
            <span
              style={{
                ...styles.stepItem,
                ...(idx === current - 1 ? styles.stepActive : {}),
                ...(idx < current - 1 ? styles.stepDone : {}),
              }}
            >
              {label}
            </span>
          </div>
          {idx < STEP_LABELS.length - 1 && <div key={`div-${idx}`} style={styles.stepDivider} />}
        </>
      ))}
    </div>
  );
}

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

function getCartId() {
  try {
    return localStorage.getItem('cartId');
  } catch {
    return null;
  }
}

export default function CheckoutReview() {
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const token = getAuthToken();
  const cartId = getCartId();

  useEffect(() => {
    fetchReview();
  }, []);

  async function fetchReview() {
    setLoading(true);
    setApiError('');
    try {
      const res = await fetch('/api/checkout/review', {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error('Failed to load order review.');
      const data = await res.json();
      setReview(data.data || data);
    } catch (err) {
      setApiError(err.message || 'Failed to load order review.');
    } finally {
      setLoading(false);
    }
  }

  async function handleApplyPromo() {
    if (!promoCode.trim()) { setPromoError('Please enter a promo code.'); return; }
    setApplyingPromo(true);
    setPromoError('');
    setPromoApplied(null);
    try {
      const res = await fetch(`/api/carts/${cartId}/promo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ code: promoCode.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoError(data.message || 'Invalid promo code.');
        return;
      }
      setPromoApplied({ code: promoCode.trim().toUpperCase(), discount: data.data?.discount || data.discount });
      fetchReview();
    } catch {
      setPromoError('Failed to apply promo code.');
    } finally {
      setApplyingPromo(false);
    }
  }

  function handleRemovePromo() {
    setPromoApplied(null);
    setPromoCode('');
    setPromoError('');
    fetchReview();
  }

  async function handlePlaceOrder() {
    setApiError('');
    setPlacingOrder(true);
    try {
      const res = await fetch('/api/checkout/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const err = await res.json();
        setApiError(err.message || 'Failed to place order. Please try again.');
        return;
      }
      const data = await res.json();
      const orderId = data.data?.id || data.id || '';
      navigate('/checkout/confirmation', { state: { orderId } });
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) return <div style={styles.spinner}>Loading order summary…</div>;

  const items = review?.items || [];
  const subtotal = review?.subtotal || 0;
  const shipping = review?.shippingCharge ?? 0;
  const tax = review?.tax || 0;
  const discount = review?.discount || (promoApplied?.discount || 0);
  const total = review?.total || (subtotal + shipping + tax - discount);
  const address = review?.address;
  const paymentMethod = review?.paymentMethod;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <StepIndicator current={3} />
        <h1 style={styles.heading}>Review Your Order</h1>

        {apiError && <div style={styles.alertError} role="alert">{apiError}</div>}

        {address && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>Delivery Address</div>
            <div style={styles.addressName}>{address.fullName}</div>
            <div style={styles.addressMeta}>
              {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}<br />
              {address.city}, {address.state} - {address.pinCode}<br />
              {address.country}<br />
              {address.phone && `Phone: ${address.phone}`}
            </div>
          </div>
        )}

        {paymentMethod && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>Payment Method</div>
            <span style={styles.paymentMethodBadge}>{paymentMethod.toUpperCase()}</span>
          </div>
        )}

        <div style={styles.card}>
          <div style={styles.cardTitle}>Items ({items.length})</div>
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

        <div style={styles.card}>
          <div style={styles.cardTitle}>Promo Code</div>
          {promoApplied ? (
            <div>
              <div style={styles.promoSuccess}>
                ✓ Code <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: '700' }}>{promoApplied.code}</span> applied — {formatCurrency(promoApplied.discount)} off
                <button style={styles.removePromoBtn} onClick={handleRemovePromo} type="button" aria-label="Remove promo code">
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={styles.promoRow}>
                <input
                  type="text"
                  aria-label="Promo code"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }}
                  style={{ ...styles.promoInput, ...(promoError ? styles.promoInputError : {}) }}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  style={{ ...styles.promoBtn, ...(applyingPromo || !promoCode.trim() ? styles.promoBtnDisabled : {}) }}
                  onClick={handleApplyPromo}
                  disabled={applyingPromo || !promoCode.trim()}
                  aria-label="Apply promo code"
                >
                  {applyingPromo ? 'Applying…' : 'Apply'}
                </button>
              </div>
              {promoError && <div style={styles.promoError} role="alert">{promoError}</div>}
            </div>
          )}
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Order Summary</div>
          <div style={styles.totalsRow}>
            <span style={styles.totalsLabel}>Subtotal</span>
            <span style={styles.totalsValue}>{formatCurrency(subtotal)}</span>
          </div>
          <div style={styles.totalsRow}>
            <span style={styles.totalsLabel}>Shipping</span>
            <span style={{ ...styles.totalsValue, ...(shipping === 0 ? styles.freeShipping : {}) }}>
              {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
            </span>
          </div>
          <div style={styles.totalsRow}>
            <span style={styles.totalsLabel}>Taxes & Fees</span>
            <span style={styles.totalsValue}>{formatCurrency(tax)}</span>
          </div>
          {discount > 0 && (
            <div style={styles.totalsRow}>
              <span style={styles.totalsLabel}>Discount</span>
              <span style={{ ...styles.totalsValue, ...styles.discount }}>−{formatCurrency(discount)}</span>
            </div>
          )}
          <div style={{ ...styles.totalsRow, ...styles.totalsRowLast }}>
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <div style={styles.actionsRow}>
          <button type="button" style={styles.backBtn} onClick={() => navigate('/checkout/payment')}>
            ← Back to Payment
          </button>
          <button
            type="button"
            style={{ ...styles.placeOrderBtn, ...(placingOrder ? styles.placeOrderBtnDisabled : {}) }}
            onClick={handlePlaceOrder}
            disabled={placingOrder}
          >
            {placingOrder ? 'Placing Order…' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
