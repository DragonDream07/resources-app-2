import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import packageIcon from '@/assets/icons/package.svg';
import mapPinIcon from '@/assets/icons/map-pin.svg';
import chevronLeftIcon from '@/assets/icons/chevron-left.svg';

const STATUS_COLORS = {
  pending: { bg: '#fff4e6', color: '#fd7e14' },
  confirmed: { bg: '#e8ecfd', color: '#4c6ef5' },
  processing: { bg: '#e8ecfd', color: '#4c6ef5' },
  shipped: { bg: '#e8ecfd', color: '#3b5bdb' },
  delivered: { bg: '#d3f9d8', color: '#37b24d' },
  cancelled: { bg: '#ffe3e3', color: '#f03e3e' },
  return_requested: { bg: '#fff4e6', color: '#fd7e14' },
  returned: { bg: '#ffe3e3', color: '#f03e3e' },
};

const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
  return_requested: ['returned', 'delivered'],
  returned: [],
};

function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || { bg: '#e9ecef', color: '#495057' };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '9999px',
        backgroundColor: colors.bg,
        color: colors.color,
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        lineHeight: '16px',
      }}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function SectionCard({ title, children }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #868e96',
        padding: '24px',
        marginBottom: '20px',
      }}
    >
      {title && (
        <h2
          style={{
            fontSize: '16px',
            fontWeight: '600',
            letterSpacing: '0em',
            lineHeight: '24px',
            color: '#212529',
            margin: '0 0 16px 0',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [advanceLoading, setAdvanceLoading] = useState(false);
  const [advanceError, setAdvanceError] = useState(null);
  const [advanceSuccess, setAdvanceSuccess] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [orderRes, timelineRes, trackingRes] = await Promise.all([
        fetch(`/orders/${id}`, { headers }),
        fetch(`/orders/${id}/timeline`, { headers }),
        fetch(`/orders/${id}/tracking`, { headers }),
      ]);

      if (!orderRes.ok) throw new Error('Failed to load order');
      const orderData = await orderRes.json();
      setOrder(orderData.order || orderData);

      if (timelineRes.ok) {
        const tlData = await timelineRes.json();
        setTimeline(tlData.timeline || tlData.data || tlData || []);
      }

      if (trackingRes.ok) {
        const trData = await trackingRes.json();
        setTracking(trData.tracking || trData);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  async function handleAdvance() {
    setAdvanceLoading(true);
    setAdvanceError(null);
    setAdvanceSuccess(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/orders/${id}/advance`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || 'Failed to advance order status');
      }
      setAdvanceSuccess('Order status advanced successfully.');
      await fetchOrder();
    } catch (err) {
      setAdvanceError(err.message || 'Failed to advance order status');
    } finally {
      setAdvanceLoading(false);
    }
  }

  async function handleCancel() {
    setCancelLoading(true);
    setCancelError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/orders/${id}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: cancelReason }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || 'Failed to cancel order');
      }
      setShowCancelModal(false);
      setCancelReason('');
      await fetchOrder();
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel order');
    } finally {
      setCancelLoading(false);
    }
  }

  const currentStatus = order?.status || '';
  const nextStatuses = STATUS_TRANSITIONS[currentStatus] || [];
  const canAdvance = nextStatuses.length > 0 && !nextStatuses.includes('cancelled');
  const canCancel = ['pending', 'confirmed', 'processing'].includes(currentStatus);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          color: '#495057',
          fontSize: '16px',
        }}
      >
        Loading order…
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#ffe3e3',
            color: '#f03e3e',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
        <Link
          to="/admin/orders"
          style={{ color: '#4c6ef5', textDecoration: 'none', fontSize: '14px' }}
        >
          ← Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        color: '#212529',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        {/* Back link */}
        <Link
          to="/admin/orders"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#4c6ef5',
            textDecoration: 'none',
            fontSize: '14px',
            marginBottom: '20px',
          }}
        >
          <img src={chevronLeftIcon} alt="" width={16} height={16} />
          Back to Orders
        </Link>

        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '-0.01em',
                lineHeight: '32px',
                margin: '0 0 8px 0',
                color: '#212529',
              }}
            >
              Order{' '}
              <span
                style={{
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                  fontSize: '20px',
                }}
              >
                #{order.id || order.orderId}
              </span>
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <StatusBadge status={order.status || 'pending'} />
              <span style={{ fontSize: '13px', color: '#495057' }}>
                Placed{' '}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {canAdvance && (
              <button
                onClick={handleAdvance}
                disabled={advanceLoading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: advanceLoading ? '#e9ecef' : '#4c6ef5',
                  color: advanceLoading ? '#adb5bd' : '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: advanceLoading ? 'not-allowed' : 'pointer',
                  minHeight: '44px',
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                {advanceLoading
                  ? 'Advancing…'
                  : `Advance to ${(nextStatuses.find((s) => s !== 'cancelled') || '').replace(/_/g, ' ')}`}
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ffffff',
                  color: '#f03e3e',
                  border: '1px solid #f03e3e',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minHeight: '44px',
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Feedback messages */}
        {advanceError && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#ffe3e3',
              color: '#f03e3e',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '14px',
            }}
          >
            {advanceError}
          </div>
        )}
        {advanceSuccess && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#d3f9d8',
              color: '#37b24d',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '14px',
            }}
          >
            {advanceSuccess}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '20px',
            alignItems: 'start',
          }}
        >
          {/* Left column */}
          <div>
            {/* Order Items */}
            <SectionCard title="Order Items">
              {(order.items || []).length === 0 ? (
                <p style={{ color: '#495057', fontSize: '14px', margin: 0 }}>No items.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(order.items || []).map((item, idx) => (
                    <div
                      key={item.id || item.itemId || idx}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        padding: '12px 0',
                        borderBottom:
                          idx < (order.items || []).length - 1
                            ? '1px solid #e9ecef'
                            : 'none',
                      }}
                    >
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '6px',
                          border: '1px solid #e9ecef',
                          overflow: 'hidden',
                          flexShrink: 0,
                          backgroundColor: '#f8f9fa',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName || 'Product'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <img src={packageIcon} alt="" width={24} height={24} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: '600',
                            fontSize: '14px',
                            color: '#212529',
                            marginBottom: '2px',
                          }}
                        >
                          {item.productName || item.name || 'Product'}
                        </div>
                        {item.skuCode && (
                          <div
                            style={{
                              fontFamily:
                                "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                              fontSize: '12px',
                              color: '#495057',
                              marginBottom: '2px',
                            }}
                          >
                            SKU: {item.skuCode}
                          </div>
                        )}
                        {item.variantLabel && (
                          <div style={{ fontSize: '12px', color: '#495057' }}>
                            {item.variantLabel}
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#212529',
                          }}
                        >
                          ₹{Number(item.price ?? item.unitPrice ?? 0).toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '12px', color: '#495057' }}>
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Shipping Address */}
            <SectionCard title="Shipping Address">
              {order.shippingAddress ? (
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                  }}
                >
                  <img src={mapPinIcon} alt="" width={18} height={18} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ fontSize: '14px', color: '#343a40', lineHeight: '1.5' }}>
                    <div style={{ fontWeight: '600' }}>
                      {order.shippingAddress.name || order.shippingAddress.fullName || '—'}
                    </div>
                    {order.shippingAddress.phone && (
                      <div style={{ color: '#495057' }}>{order.shippingAddress.phone}</div>
                    )}
                    <div>
                      {[order.shippingAddress.line1, order.shippingAddress.line2]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                    <div>
                      {[order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.pinCode]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#495057', fontSize: '14px', margin: 0 }}>No address.</p>
              )}
            </SectionCard>

            {/* Tracking Info */}
            {tracking && (
              <SectionCard title="Tracking">
                <div style={{ fontSize: '14px', color: '#343a40', lineHeight: '1.5' }}>
                  {tracking.carrier && (
                    <div style={{ marginBottom: '4px' }}>
                      <span style={{ fontWeight: '500' }}>Carrier:</span> {tracking.carrier}
                    </div>
                  )}
                  {tracking.trackingNumber && (
                    <div style={{ marginBottom: '4px' }}>
                      <span style={{ fontWeight: '500' }}>Tracking No:</span>{' '}
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                          fontSize: '13px',
                        }}
                      >
                        {tracking.trackingNumber}
                      </span>
                    </div>
                  )}
                  {tracking.estimatedDelivery && (
                    <div>
                      <span style={{ fontWeight: '500' }}>Estimated Delivery:</span>{' '}
                      {new Date(tracking.estimatedDelivery).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  )}
                </div>
              </SectionCard>
            )}

            {/* Status Timeline */}
            {timeline.length > 0 && (
              <SectionCard title="Status Timeline">
                <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {timeline.map((entry, idx) => (
                    <li
                      key={entry.id || idx}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        paddingBottom: idx < timeline.length - 1 ? '16px' : '0',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: '#4c6ef5',
                          flexShrink: 0,
                          marginTop: '4px',
                          border: '2px solid #e8ecfd',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#212529',
                            textTransform: 'capitalize',
                          }}
                        >
                          {(entry.status || entry.toStatus || '').replace(/_/g, ' ')}
                        </div>
                        {entry.note && (
                          <div style={{ fontSize: '13px', color: '#495057', marginTop: '2px' }}>
                            {entry.note}
                          </div>
                        )}
                        <div style={{ fontSize: '12px', color: '#868e96', marginTop: '2px' }}>
                          {entry.createdAt || entry.timestamp
                            ? new Date(entry.createdAt || entry.timestamp).toLocaleString(
                                'en-IN',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )
                            : ''}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </SectionCard>
            )}
          </div>

          {/* Right column */}
          <div>
            {/* Order Summary */}
            <SectionCard title="Order Summary">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <SummaryRow
                  label="Subtotal"
                  value={`₹${Number(order.subtotal ?? order.subTotal ?? 0).toLocaleString('en-IN')}`}
                />
                {(order.discount || order.discountAmount) && (
                  <SummaryRow
                    label="Discount"
                    value={`-₹${Number(order.discount ?? order.discountAmount ?? 0).toLocaleString('en-IN')}`}
                    valueColor="#f03e3e"
                  />
                )}
                {(order.promoCode || order.promoDiscount) && (
                  <SummaryRow
                    label={`Promo${order.promoCode ? ` (${order.promoCode})` : ''}`}
                    value={`-₹${Number(order.promoDiscount ?? 0).toLocaleString('en-IN')}`}
                    valueColor="#37b24d"
                  />
                )}
                <SummaryRow
                  label="Shipping"
                  value={
                    order.shippingFee != null
                      ? Number(order.shippingFee) === 0
                        ? 'Free'
                        : `₹${Number(order.shippingFee).toLocaleString('en-IN')}`
                      : '—'
                  }
                />
                <div
                  style={{
                    borderTop: '1px solid #e9ecef',
                    paddingTop: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: '700',
                    fontSize: '16px',
                    color: '#212529',
                  }}
                >
                  <span>Total</span>
                  <span>
                    ₹{Number(order.total ?? order.totalAmount ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>
                {order.paymentMethod && (
                  <div
                    style={{
                      marginTop: '4px',
                      fontSize: '12px',
                      color: '#495057',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Payment</span>
                    <span style={{ textTransform: 'capitalize' }}>{order.paymentMethod}</span>
                  </div>
                )}
                {order.paymentStatus && (
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#495057',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Payment Status</span>
                    <span
                      style={{
                        textTransform: 'capitalize',
                        color:
                          order.paymentStatus === 'paid' ? '#37b24d' : '#fd7e14',
                        fontWeight: '600',
                      }}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Customer Info */}
            <SectionCard title="Customer">
              <div style={{ fontSize: '14px', color: '#343a40', lineHeight: '1.7' }}>
                <div style={{ fontWeight: '600' }}>
                  {order.customerName || order.customer?.name || '—'}
                </div>
                {(order.customerEmail || order.customer?.email) && (
                  <div style={{ color: '#495057' }}>
                    {order.customerEmail || order.customer?.email}
                  </div>
                )}
                {(order.customerPhone || order.customer?.phone) && (
                  <div style={{ color: '#495057' }}>
                    {order.customerPhone || order.customer?.phone}
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Status Controls */}
            <SectionCard title="Status Controls">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '13px', color: '#495057', marginBottom: '4px' }}>
                  Current:{' '}
                  <strong style={{ color: '#212529', textTransform: 'capitalize' }}>
                    {currentStatus.replace(/_/g, ' ')}
                  </strong>
                </div>
                {canAdvance && (
                  <button
                    onClick={handleAdvance}
                    disabled={advanceLoading}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      backgroundColor: advanceLoading ? '#e9ecef' : '#4c6ef5',
                      color: advanceLoading ? '#adb5bd' : '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: advanceLoading ? 'not-allowed' : 'pointer',
                      minHeight: '44px',
                      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                      textAlign: 'center',
                    }}
                  >
                    {advanceLoading
                      ? 'Advancing…'
                      : `Mark as ${(nextStatuses.find((s) => s !== 'cancelled') || '').replace(/_/g, ' ')}`}
                  </button>
                )}
                {canCancel && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      backgroundColor: '#ffffff',
                      color: '#f03e3e',
                      border: '1px solid #f03e3e',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      minHeight: '44px',
                      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    Cancel Order
                  </button>
                )}
                {!canAdvance && !canCancel && (
                  <p style={{ fontSize: '13px', color: '#495057', margin: 0 }}>
                    No further actions available.
                  </p>
                )}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(33,37,41,0.48)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCancelModal(false);
              setCancelError(null);
            }
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              width: '100%',
              maxWidth: '440px',
              boxShadow: '0 8px 32px rgba(33,37,41,0.16)',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#212529',
                margin: '0 0 8px 0',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              Cancel Order
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: '#495057',
                margin: '0 0 20px 0',
                lineHeight: '1.5',
              }}
            >
              This action cannot be undone. Please provide a reason for cancellation.
            </p>

            {cancelError && (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#ffe3e3',
                  color: '#f03e3e',
                  borderRadius: '6px',
                  fontSize: '13px',
                  marginBottom: '16px',
                }}
              >
                {cancelError}
              </div>
            )}

            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#343a40',
                marginBottom: '6px',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              Reason (optional)
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              placeholder="Enter reason for cancellation…"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #868e96',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#212529',
                backgroundColor: '#ffffff',
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                resize: 'vertical',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelError(null);
                }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#ffffff',
                  color: '#343a40',
                  border: '1px solid #868e96',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minHeight: '44px',
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                Keep Order
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: cancelLoading ? '#e9ecef' : '#f03e3e',
                  color: cancelLoading ? '#adb5bd' : '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: cancelLoading ? 'not-allowed' : 'pointer',
                  minHeight: '44px',
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                {cancelLoading ? 'Cancelling…' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value, valueColor }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        color: '#343a40',
      }}
    >
      <span style={{ color: '#495057' }}>{label}</span>
      <span style={{ fontWeight: '500', color: valueColor || '#212529' }}>{value}</span>
    </div>
  );
}
