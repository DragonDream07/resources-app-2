import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import emptyStateImg from '@/assets/images/empty-state.svg';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const CART_ID_KEY = 'cartId';
const API_BASE = '/api';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getCartId() {
  return localStorage.getItem(CART_ID_KEY);
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
function Toast({ toasts }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 9999,
      }}
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          style={{
            padding: '12px 20px',
            borderRadius: '10px',
            background: t.type === 'error' ? '#ffe3e3' : '#d3f9d8',
            color: t.type === 'error' ? '#f03e3e' : '#37b24d',
            border: `1px solid ${t.type === 'error' ? '#f03e3e' : '#37b24d'}`,
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(33,37,41,0.12)',
            minWidth: '220px',
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  let counter = 0;

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + (++counter);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return { toasts, showToast };
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------
function SkeletonRow() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        padding: '24px',
        background: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #868e96',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '6px',
          background: '#e9ecef',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ height: '18px', background: '#e9ecef', borderRadius: '4px', width: '60%' }} />
        <div style={{ height: '14px', background: '#e9ecef', borderRadius: '4px', width: '35%' }} />
        <div style={{ height: '14px', background: '#e9ecef', borderRadius: '4px', width: '25%' }} />
      </div>
      <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
        <div style={{ height: '20px', background: '#e9ecef', borderRadius: '4px', width: '60px' }} />
        <div style={{ height: '32px', background: '#e9ecef', borderRadius: '6px', width: '80px' }} />
      </div>
    </div>
  );
}

function SkeletonSummary() {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #868e96',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{ height: '16px', background: '#e9ecef', borderRadius: '4px' }} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quantity Stepper
// ---------------------------------------------------------------------------
function QuantityStepper({ value, onDecrease, onIncrease, disabled }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        border: '1px solid #868e96',
        borderRadius: '6px',
        overflow: 'hidden',
        width: 'fit-content',
      }}
    >
      <button
        onClick={onDecrease}
        disabled={disabled || value <= 1}
        aria-label="Decrease quantity"
        style={{
          width: '36px',
          height: '36px',
          minWidth: '44px',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: disabled || value <= 1 ? '#e9ecef' : '#ffffff',
          border: 'none',
          cursor: disabled || value <= 1 ? 'not-allowed' : 'pointer',
          borderRight: '1px solid #868e96',
        }}
      >
        <img src={minusIcon} alt="minus" width={14} height={14} />
      </button>
      <span
        aria-live="polite"
        style={{
          minWidth: '40px',
          textAlign: 'center',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '16px',
          fontWeight: 500,
          color: '#212529',
          padding: '0 8px',
        }}
      >
        {value}
      </span>
      <button
        onClick={onIncrease}
        disabled={disabled}
        aria-label="Increase quantity"
        style={{
          width: '36px',
          height: '36px',
          minWidth: '44px',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: disabled ? '#e9ecef' : '#ffffff',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          borderLeft: '1px solid #868e96',
        }}
      >
        <img src={plusIcon} alt="plus" width={14} height={14} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cart Item Card
// ---------------------------------------------------------------------------
function CartItemCard({ item, onRemove, onQuantityChange, actionLoading }) {
  const imageUrl = item.image_url || placeholderProduct;
  const isLoading = actionLoading === item.id;

  const lineTotal = ((item.price || 0) * item.quantity).toFixed(2);

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        padding: '24px',
        background: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #868e96',
        alignItems: 'flex-start',
        opacity: isLoading ? 0.6 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {/* Product image */}
      <div
        style={{
          width: '100px',
          height: '100px',
          flexShrink: 0,
          borderRadius: '6px',
          overflow: 'hidden',
          background: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e9ecef',
        }}
      >
        <img
          src={imageUrl}
          alt={item.product_name || 'Product'}
          onError={(e) => { e.currentTarget.src = placeholderProduct; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: '0 0 4px 0',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '16px',
            fontWeight: 600,
            color: '#212529',
            lineHeight: '24px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.product_name || 'Product'}
        </p>

        {item.sku_label && (
          <p
            style={{
              margin: '0 0 8px 0',
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              fontSize: '12px',
              color: '#495057',
              lineHeight: '16px',
            }}
          >
            SKU: {item.sku_label}
          </p>
        )}

        <p
          style={{
            margin: '0 0 12px 0',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '14px',
            color: '#495057',
            lineHeight: '20px',
          }}
        >
          ₹{(item.price || 0).toFixed(2)} each
        </p>

        <QuantityStepper
          value={item.quantity}
          onDecrease={() => onQuantityChange(item, item.quantity - 1)}
          onIncrease={() => onQuantityChange(item, item.quantity + 1)}
          disabled={isLoading}
        />
      </div>

      {/* Price + Remove */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '16px',
            fontWeight: 700,
            color: '#212529',
            lineHeight: '24px',
          }}
        >
          ₹{lineTotal}
        </p>

        <button
          onClick={() => onRemove(item)}
          disabled={isLoading}
          aria-label={`Remove ${item.product_name || 'item'} from cart`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            color: '#f03e3e',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 400,
            padding: '4px 0',
            minHeight: '44px',
            textDecoration: 'none',
          }}
        >
          <img src={trashIcon} alt="" width={14} height={14} style={{ opacity: isLoading ? 0.5 : 1 }} />
          Remove
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Promo Code
// ---------------------------------------------------------------------------
function PromoSection({ cartId, promoApplied, onPromoApplied, showToast }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      await apiFetch(`/carts/${cartId}/promo`, {
        method: 'POST',
        body: JSON.stringify({ promo_code: code.trim() }),
      });
      onPromoApplied(code.trim());
      showToast('Promo code applied!', 'success');
    } catch (err) {
      setError(err.message || 'Invalid promo code.');
    } finally {
      setLoading(false);
    }
  };

  if (promoApplied) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: '#d3f9d8',
          border: '1px solid #37b24d',
          borderRadius: '6px',
          marginBottom: '16px',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            fontSize: '14px',
            color: '#37b24d',
            fontWeight: 600,
          }}
        >
          {promoApplied}
        </span>
        <span
          style={{
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '12px',
            color: '#37b24d',
          }}
        >
          Applied ✓
        </span>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleApply(); }}
          placeholder="Promo code"
          disabled={loading}
          aria-label="Promo code"
          style={{
            flex: 1,
            padding: '10px 12px',
            border: `1px solid ${error ? '#f03e3e' : '#868e96'}`,
            borderRadius: '6px',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '14px',
            color: '#212529',
            background: loading ? '#e9ecef' : '#ffffff',
            outline: 'none',
            minHeight: '44px',
          }}
        />
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          style={{
            padding: '10px 16px',
            background: loading || !code.trim() ? '#e9ecef' : '#4c6ef5',
            color: loading || !code.trim() ? '#adb5bd' : '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            cursor: loading || !code.trim() ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
            minHeight: '44px',
          }}
        >
          {loading ? 'Applying…' : 'Apply'}
        </button>
      </div>
      {error && (
        <p
          role="alert"
          style={{
            margin: '6px 0 0 0',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '12px',
            color: '#f03e3e',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Summary Panel
// ---------------------------------------------------------------------------
function SummaryPanel({ cart, promoApplied, onPromoApplied, showToast, onCheckout, checkoutLoading }) {
  const subtotal = cart.subtotal ?? cart.items?.reduce((s, i) => s + (i.price || 0) * i.quantity, 0) ?? 0;
  const discount = cart.discount ?? 0;
  const deliveryFee = cart.delivery_fee ?? 0;
  const total = cart.total ?? (subtotal - discount + deliveryFee);

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #868e96',
        borderRadius: '10px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        position: 'sticky',
        top: '24px',
      }}
    >
      <h2
        style={{
          margin: '0 0 20px 0',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '20px',
          fontWeight: 600,
          color: '#212529',
          lineHeight: '28px',
        }}
      >
        Order Summary
      </h2>

      <PromoSection
        cartId={cart.id}
        promoApplied={promoApplied}
        onPromoApplied={onPromoApplied}
        showToast={showToast}
      />

      <div
        style={{
          borderTop: '1px solid #e9ecef',
          paddingTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <SummaryRow label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
        {discount > 0 && (
          <SummaryRow label="Discount" value={`-₹${discount.toFixed(2)}`} valueColor="#37b24d" />
        )}
        <SummaryRow label="Delivery" value={deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`} />
      </div>

      <div
        style={{
          borderTop: '2px solid #343a40',
          marginTop: '16px',
          paddingTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '24px',
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '16px',
            fontWeight: 700,
            color: '#212529',
          }}
        >
          Total
        </span>
        <span
          style={{
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '20px',
            fontWeight: 700,
            color: '#212529',
          }}
        >
          ₹{total.toFixed(2)}
        </span>
      </div>

      <button
        onClick={onCheckout}
        disabled={checkoutLoading || !cart.items || cart.items.length === 0}
        style={{
          width: '100%',
          padding: '14px 24px',
          background:
            checkoutLoading || !cart.items || cart.items.length === 0
              ? '#e9ecef'
              : '#4c6ef5',
          color:
            checkoutLoading || !cart.items || cart.items.length === 0
              ? '#adb5bd'
              : '#ffffff',
          border: 'none',
          borderRadius: '10px',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '16px',
          fontWeight: 600,
          cursor:
            checkoutLoading || !cart.items || cart.items.length === 0
              ? 'not-allowed'
              : 'pointer',
          minHeight: '44px',
          letterSpacing: '0em',
        }}
      >
        {checkoutLoading ? 'Processing…' : 'Proceed to Checkout'}
      </button>

      <p
        style={{
          margin: '12px 0 0 0',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '12px',
          color: '#495057',
          textAlign: 'center',
          lineHeight: '16px',
        }}
      >
        Secure checkout — your data is protected
      </p>
    </div>
  );
}

function SummaryRow({ label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span
        style={{
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '14px',
          color: '#495057',
          lineHeight: '20px',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '14px',
          fontWeight: 500,
          color: valueColor || '#212529',
          lineHeight: '20px',
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------
function EmptyCart() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        minHeight: '400px',
      }}
    >
      <img src={emptyStateImg} alt="Empty cart" width={160} height={160} style={{ marginBottom: '24px', opacity: 0.7 }} />
      <h2
        style={{
          margin: '0 0 12px 0',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '24px',
          fontWeight: 700,
          color: '#212529',
          lineHeight: '32px',
        }}
      >
        Your cart is empty
      </h2>
      <p
        style={{
          margin: '0 0 32px 0',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '16px',
          color: '#495057',
          lineHeight: '24px',
          maxWidth: '400px',
        }}
      >
        Looks like you haven't added anything yet. Browse our products and find something you love.
      </p>
      <Link
        to="/products"
        style={{
          display: 'inline-block',
          padding: '12px 32px',
          background: '#4c6ef5',
          color: '#ffffff',
          borderRadius: '10px',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '16px',
          fontWeight: 600,
          textDecoration: 'none',
          minHeight: '44px',
          lineHeight: '20px',
        }}
      >
        Start shopping
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error State
// ---------------------------------------------------------------------------
function CartError({ onRetry }) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        minHeight: '400px',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '9999px',
          background: '#ffe3e3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          fontSize: '28px',
        }}
      >
        ⚠️
      </div>
      <h2
        style={{
          margin: '0 0 12px 0',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '24px',
          fontWeight: 700,
          color: '#212529',
          lineHeight: '32px',
        }}
      >
        Couldn't load your cart
      </h2>
      <p
        style={{
          margin: '0 0 32px 0',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '16px',
          color: '#495057',
          lineHeight: '24px',
        }}
      >
        Please refresh the page.
      </p>
      <button
        onClick={onRetry}
        style={{
          padding: '12px 32px',
          background: '#4c6ef5',
          color: '#ffffff',
          border: 'none',
          borderRadius: '10px',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          minHeight: '44px',
        }}
      >
        Refresh
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Cart Page
// ---------------------------------------------------------------------------
export default function Cart() {
  const navigate = useNavigate();
  const { toasts, showToast } = useToast();

  const [status, setStatus] = useState('loading'); // 'loading' | 'empty' | 'loaded' | 'error'
  const [cart, setCart] = useState(null);
  const [promoApplied, setPromoApplied] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // item id under action
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // -------------------------------------------------------------------
  // Load cart
  // -------------------------------------------------------------------
  const loadCart = useCallback(async () => {
    setStatus('loading');
    const cartId = getCartId();
    if (!cartId) {
      setStatus('empty');
      return;
    }
    try {
      const data = await apiFetch(`/carts/${cartId}`);
      if (!data.items || data.items.length === 0) {
        setCart(data);
        setStatus('empty');
      } else {
        setCart(data);
        setStatus('loaded');
      }
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // -------------------------------------------------------------------
  // Remove item
  // -------------------------------------------------------------------
  const handleRemove = useCallback(async (item) => {
    const cartId = getCartId();
    if (!cartId) return;
    setActionLoading(item.id);
    try {
      await apiFetch(`/carts/${cartId}/items/${item.id}`, { method: 'DELETE' });
      setCart((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, items: prev.items.filter((i) => i.id !== item.id) };
        // Recalculate subtotal client-side if server doesn't return it
        const subtotal = updated.items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);
        return { ...updated, subtotal, total: subtotal - (updated.discount ?? 0) + (updated.delivery_fee ?? 0) };
      });
      showToast('Item removed from cart', 'success');
      setCart((prev) => {
        if (prev && prev.items && prev.items.length === 0) {
          setStatus('empty');
        }
        return prev;
      });
    } catch (err) {
      showToast(err.message || 'Failed to remove item.', 'error');
    } finally {
      setActionLoading(null);
    }
  }, [showToast]);

  // -------------------------------------------------------------------
  // Update quantity
  // -------------------------------------------------------------------
  const handleQuantityChange = useCallback(async (item, newQty) => {
    if (newQty < 0) return;
    const cartId = getCartId();
    if (!cartId) return;

    // quantity 0 → remove
    if (newQty === 0) {
      return handleRemove(item);
    }

    setActionLoading(item.id);
    try {
      await apiFetch(`/carts/${cartId}/items/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity: newQty }),
      });
      setCart((prev) => {
        if (!prev) return prev;
        const items = prev.items.map((i) =>
          i.id === item.id ? { ...i, quantity: newQty } : i
        );
        const subtotal = items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);
        return {
          ...prev,
          items,
          subtotal,
          total: subtotal - (prev.discount ?? 0) + (prev.delivery_fee ?? 0),
        };
      });
    } catch (err) {
      showToast(err.message || 'Failed to update quantity.', 'error');
    } finally {
      setActionLoading(null);
    }
  }, [handleRemove, showToast]);

  // -------------------------------------------------------------------
  // Checkout
  // -------------------------------------------------------------------
  const handleCheckout = useCallback(async () => {
    setCheckoutLoading(true);
    try {
      navigate('/checkout/review');
    } catch {
      showToast('Unable to proceed. Please try again.', 'error');
    } finally {
      setCheckoutLoading(false);
    }
  }, [navigate, showToast]);

  // -------------------------------------------------------------------
  // Render helpers
  // -------------------------------------------------------------------
  const itemCount = cart?.items?.length ?? 0;

  // -------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Inner container */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px',
        }}
      >
        {/* Page title */}
        <h1
          style={{
            margin: '0 0 24px 0',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '32px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: '40px',
            color: '#212529',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          Your cart
          {status === 'loaded' && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '2px 10px',
                background: '#e8ecfd',
                color: '#4c6ef5',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0em',
                verticalAlign: 'middle',
              }}
            >
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          )}
        </h1>

        {/* Loading */}
        {status === 'loading' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr minmax(280px, 360px)',
              gap: '32px',
              alignItems: 'start',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
            <SkeletonSummary />
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <CartError onRetry={loadCart} />
        )}

        {/* Empty */}
        {status === 'empty' && <EmptyCart />}

        {/* Loaded */}
        {status === 'loaded' && cart && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr minmax(280px, 360px)',
              gap: '32px',
              alignItems: 'start',
            }}
          >
            {/* Left: Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  onQuantityChange={handleQuantityChange}
                  actionLoading={actionLoading}
                />
              ))}

              {/* Back to shopping link */}
              <div style={{ paddingTop: '8px' }}>
                <Link
                  to="/products"
                  style={{
                    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: '14px',
                    color: '#4c6ef5',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    minHeight: '44px',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#3b5bdb'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#4c6ef5'; }}
                >
                  ← Continue shopping
                </Link>
              </div>
            </div>

            {/* Right: Summary */}
            <SummaryPanel
              cart={cart}
              promoApplied={promoApplied}
              onPromoApplied={setPromoApplied}
              showToast={showToast}
              onCheckout={handleCheckout}
              checkoutLoading={checkoutLoading}
            />
          </div>
        )}
      </div>

      {/* Toast notifications */}
      <Toast toasts={toasts} />
    </div>
  );
}
