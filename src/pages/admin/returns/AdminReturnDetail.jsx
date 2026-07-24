import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import packageIcon from '@/assets/icons/package.svg';

const STATUS_STYLES = {
  pending: { background: '#fff4e6', color: '#fd7e14' },
  approved: { background: '#d3f9d8', color: '#37b24d' },
  rejected: { background: '#ffe3e3', color: '#f03e3e' },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || { background: '#e8ecfd', color: '#4c6ef5' };
  return (
    <span
      style={{
        ...style,
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        display: 'inline-block',
      }}
    >
      {status}
    </span>
  );
}

function DetailRow({ label, value, mono }) {
  return (
    <div
      style={{
        display: 'flex',
        borderBottom: '1px solid #e9ecef',
        padding: '12px 0',
        gap: '16px',
      }}
    >
      <span
        style={{
          minWidth: '180px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#495057',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '14px',
          color: '#212529',
          fontFamily: mono
            ? "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
            : undefined,
          wordBreak: 'break-word',
        }}
      >
        {value ?? '—'}
      </span>
    </div>
  );
}

export default function AdminReturnDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [returnRequest, setReturnRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviewAction, setReviewAction] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const fetchReturn = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/return-requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load return request.');
      const data = await res.json();
      setReturnRequest(data.returnRequest ?? data.data ?? data);
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReturn();
  }, [fetchReturn]);

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!reviewAction) {
      setSubmitError('Please select an action (Approve or Reject).');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/return-requests/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: reviewAction,
          adminNotes: adminNotes.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to submit review.');
      }
      const data = await res.json();
      setReturnRequest(data.returnRequest ?? data.data ?? data);
      setSubmitSuccess(
        reviewAction === 'approve'
          ? 'Return request approved successfully.'
          : 'Return request rejected successfully.',
      );
      setReviewAction('');
      setAdminNotes('');
    } catch (err) {
      setSubmitError(err.message || 'An error occurred.');
    } finally {
      setSubmitting(false);
    }
  }

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#f8f9fa',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      color: '#212529',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      color: '#4c6ef5',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '20px',
    },
    header: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      letterSpacing: '-0.01em',
      lineHeight: '32px',
      margin: 0,
    },
    subtitle: {
      fontSize: '14px',
      color: '#495057',
      marginTop: '4px',
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 380px',
      gap: '24px',
      alignItems: 'start',
    },
    card: {
      background: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
      padding: '24px',
      marginBottom: '24px',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#212529',
      margin: '0 0 16px 0',
      paddingBottom: '12px',
      borderBottom: '2px solid #e8ecfd',
    },
    errorBox: {
      background: '#ffe3e3',
      color: '#f03e3e',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '20px',
      fontSize: '14px',
    },
    successBox: {
      background: '#d3f9d8',
      color: '#37b24d',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#495057',
      marginBottom: '6px',
    },
    select: {
      width: '100%',
      padding: '10px 14px',
      border: '1px solid #868e96',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#212529',
      background: '#ffffff',
      outline: 'none',
      cursor: 'pointer',
      marginBottom: '16px',
      minHeight: '44px',
    },
    textarea: {
      width: '100%',
      padding: '10px 14px',
      border: '1px solid #868e96',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#212529',
      background: '#ffffff',
      outline: 'none',
      resize: 'vertical',
      minHeight: '100px',
      marginBottom: '16px',
      boxSizing: 'border-box',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    approveBtn: {
      width: '100%',
      padding: '12px 20px',
      background: '#37b24d',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      marginBottom: '10px',
      transition: 'background 0.15s',
    },
    rejectBtn: {
      width: '100%',
      padding: '12px 20px',
      background: '#f03e3e',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      marginBottom: '10px',
      transition: 'background 0.15s',
    },
    submitBtn: {
      width: '100%',
      padding: '12px 20px',
      background: '#4c6ef5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: submitting ? 'not-allowed' : 'pointer',
      minHeight: '44px',
      opacity: submitting ? 0.7 : 1,
    },
    disabledNote: {
      fontSize: '13px',
      color: '#adb5bd',
      textAlign: 'center',
      marginTop: '8px',
    },
    imageGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
      gap: '12px',
      marginTop: '12px',
    },
    image: {
      width: '100%',
      aspectRatio: '1',
      objectFit: 'cover',
      borderRadius: '6px',
      border: '1px solid #e9ecef',
    },
    itemRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 0',
      borderBottom: '1px solid #e9ecef',
    },
    itemImg: {
      width: '56px',
      height: '56px',
      objectFit: 'cover',
      borderRadius: '6px',
      border: '1px solid #e9ecef',
      flexShrink: 0,
    },
    loadingState: {
      padding: '48px 24px',
      textAlign: 'center',
      color: '#495057',
      background: '#ffffff',
      borderRadius: '10px',
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingState}>Loading return request&hellip;</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorBox}>{error}</div>
          <Link to="/admin/returns" style={styles.backLink}>
            <img src={chevronLeft} alt="" style={{ width: '16px', height: '16px' }} />
            Back to Returns
          </Link>
        </div>
      </div>
    );
  }

  if (!returnRequest) return null;

  const rr = returnRequest;
  const isPending = (rr.status ?? 'pending') === 'pending';
  const orderId = rr.orderId ?? rr.order_id;
  const customerId = rr.userId ?? rr.user_id;
  const customerName = rr.user?.name ?? rr.customerName ?? rr.customer_name;
  const customerEmail = rr.user?.email ?? rr.customerEmail ?? rr.customer_email;
  const submittedAt = rr.createdAt ?? rr.created_at;
  const updatedAt = rr.updatedAt ?? rr.updated_at;
  const items = rr.items ?? rr.returnItems ?? [];
  const images = rr.images ?? rr.evidenceImages ?? [];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/admin/returns" style={styles.backLink}>
          <img src={chevronLeft} alt="" style={{ width: '16px', height: '16px' }} />
          Back to Returns
        </Link>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Return Request Detail</h1>
            <div style={styles.subtitle}>ID: {rr.id}</div>
          </div>
          <StatusBadge status={rr.status ?? 'pending'} />
        </div>

        <div style={styles.grid}>
          {/* Left column */}
          <div>
            {/* Request Info */}
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Request Information</h2>
              <DetailRow label="Request ID" value={rr.id} mono />
              <DetailRow
                label="Order ID"
                value={
                  orderId ? (
                    <Link
                      to={`/admin/orders/${orderId}`}
                      style={{ color: '#4c6ef5', textDecoration: 'none', fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}
                    >
                      {orderId}
                    </Link>
                  ) : '—'
                }
              />
              <DetailRow label="Status" value={<StatusBadge status={rr.status ?? 'pending'} />} />
              <DetailRow label="Reason" value={rr.reason} />
              <DetailRow label="Description" value={rr.description ?? rr.notes} />
              <DetailRow
                label="Submitted"
                value={submittedAt ? new Date(submittedAt).toLocaleString() : '—'}
              />
              <DetailRow
                label="Last Updated"
                value={updatedAt ? new Date(updatedAt).toLocaleString() : '—'}
              />
              {rr.adminNotes && (
                <DetailRow label="Admin Notes" value={rr.adminNotes ?? rr.admin_notes} />
              )}
            </div>

            {/* Customer Info */}
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Customer</h2>
              {customerId && <DetailRow label="Customer ID" value={customerId} mono />}
              {customerName && <DetailRow label="Name" value={customerName} />}
              {customerEmail && <DetailRow label="Email" value={customerEmail} />}
              {!customerId && !customerName && !customerEmail && (
                <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>No customer details available.</p>
              )}
            </div>

            {/* Return Items */}
            {items.length > 0 && (
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>Return Items</h2>
                {items.map((item, idx) => (
                  <div key={item.id ?? idx} style={styles.itemRow}>
                    <img
                      src={
                        item.product?.image ??
                        item.imageUrl ??
                        item.image_url ??
                        '/src/assets/images/placeholder-product.svg'
                      }
                      alt={item.product?.name ?? item.name ?? 'Product'}
                      style={styles.itemImg}
                      onError={e => {
                        e.target.src = '/src/assets/images/placeholder-product.svg';
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#212529', marginBottom: '2px' }}>
                        {item.product?.name ?? item.name ?? 'Unknown Product'}
                      </div>
                      {(item.sku ?? item.skuCode ?? item.sku_code) && (
                        <div
                          style={{
                            fontSize: '12px',
                            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                            color: '#495057',
                          }}
                        >
                          SKU: {item.sku ?? item.skuCode ?? item.sku_code}
                        </div>
                      )}
                      <div style={{ fontSize: '13px', color: '#495057', marginTop: '4px' }}>
                        Qty: {item.quantity ?? item.qty ?? 1}
                      </div>
                    </div>
                    {(item.price ?? item.unitPrice ?? item.unit_price) != null && (
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#212529', whiteSpace: 'nowrap' }}>
                        ₹{((item.price ?? item.unitPrice ?? item.unit_price) / 100).toFixed(2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Evidence Images */}
            {images.length > 0 && (
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>Evidence Images</h2>
                <div style={styles.imageGrid}>
                  {images.map((img, idx) => (
                    <a
                      key={idx}
                      href={img.url ?? img}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View evidence image ${idx + 1}`}
                    >
                      <img
                        src={img.url ?? img}
                        alt={`Evidence ${idx + 1}`}
                        style={styles.image}
                        onError={e => {
                          e.target.src = '/src/assets/images/placeholder-product.svg';
                        }}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column — review panel */}
          <div>
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Review Decision</h2>

              {submitSuccess && (
                <div style={styles.successBox}>{submitSuccess}</div>
              )}

              {submitError && (
                <div style={styles.errorBox}>{submitError}</div>
              )}

              {isPending ? (
                <form onSubmit={handleReviewSubmit} noValidate>
                  <label htmlFor="review-action" style={styles.label}>
                    Action <span style={{ color: '#f03e3e' }}>*</span>
                  </label>
                  <select
                    id="review-action"
                    value={reviewAction}
                    onChange={e => setReviewAction(e.target.value)}
                    style={styles.select}
                    aria-required="true"
                  >
                    <option value="">Select action&hellip;</option>
                    <option value="approve">Approve</option>
                    <option value="reject">Reject</option>
                  </select>

                  <label htmlFor="admin-notes" style={styles.label}>
                    Admin Notes
                  </label>
                  <textarea
                    id="admin-notes"
                    value={adminNotes}
                    onChange={e => setAdminNotes(e.target.value)}
                    placeholder="Optional notes for the customer or internal records"
                    style={styles.textarea}
                    aria-label="Admin notes"
                  />

                  <button
                    type="submit"
                    disabled={submitting || !reviewAction}
                    style={{
                      ...styles.submitBtn,
                      ...(reviewAction === 'approve'
                        ? { background: '#37b24d' }
                        : reviewAction === 'reject'
                        ? { background: '#f03e3e' }
                        : {}),
                      opacity: submitting || !reviewAction ? 0.65 : 1,
                      cursor: submitting || !reviewAction ? 'not-allowed' : 'pointer',
                    }}
                    aria-busy={submitting}
                  >
                    {submitting
                      ? 'Submitting…'
                      : reviewAction === 'approve'
                      ? 'Approve Return'
                      : reviewAction === 'reject'
                      ? 'Reject Return'
                      : 'Submit Decision'}
                  </button>
                </form>
              ) : (
                <div>
                  <p style={{ fontSize: '14px', color: '#495057', margin: '0 0 12px 0' }}>
                    This return request has already been reviewed.
                  </p>
                  <StatusBadge status={rr.status} />
                  {(rr.adminNotes ?? rr.admin_notes) && (
                    <div
                      style={{
                        marginTop: '16px',
                        padding: '12px',
                        background: '#f8f9fa',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#343a40',
                        borderLeft: '3px solid #4c6ef5',
                      }}
                    >
                      <span style={{ fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                        Admin Notes
                      </span>
                      {rr.adminNotes ?? rr.admin_notes}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick links */}
            {orderId && (
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>Quick Links</h2>
                <Link
                  to={`/admin/orders/${orderId}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#4c6ef5',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    padding: '10px 0',
                    minHeight: '44px',
                  }}
                >
                  <img src={packageIcon} alt="" style={{ width: '16px', height: '16px' }} />
                  View Order #{orderId}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
