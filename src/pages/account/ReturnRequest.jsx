import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

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
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    marginBottom: '8px',
  },
  muted: {
    fontSize: '14px',
    color: '#495057',
    margin: '0 0 24px 0',
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
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '6px',
  },
  itemCheckRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #e9ecef',
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    margin: 0,
  },
  itemMeta: {
    fontSize: '12px',
    color: '#495057',
    margin: '2px 0 0 0',
  },
  select: {
    display: 'block',
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    marginBottom: '16px',
  },
  textarea: {
    display: 'block',
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '100px',
    resize: 'vertical',
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
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  fieldError: {
    color: '#f03e3e',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block',
    marginBottom: '8px',
  },
  successPanel: {
    textAlign: 'center',
    padding: '48px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  successIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    margin: '0 0 8px 0',
  },
  successSub: {
    fontSize: '14px',
    color: '#495057',
    margin: '0 0 24px 0',
  },
  skeleton: {
    height: '80px',
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    marginBottom: '16px',
  },
};

const RETURN_REASONS = [
  'Damaged item',
  'Wrong item received',
  'Item not as described',
  'Changed my mind',
  'Other',
];

export default function ReturnRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/orders/${id}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Order not found.');
        return res.json();
      })
      .then((data) => setOrder(data.data || data))
      .catch((err) => setLoadError(err.message || 'Failed to load order.'))
      .finally(() => setLoading(false));
  }, [id]);

  function toggleItem(itemId) {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((x) => x !== itemId) : [...prev, itemId]
    );
  }

  function validate() {
    const errs = {};
    if (selectedItems.length === 0) errs.items = 'Please select at least one item to return.';
    if (!reason) errs.reason = 'Please select a reason for return.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setFormErrors({});
    setSubmitting(true);
    try {
      const res = await fetch(`/orders/${id}/return-requests`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: selectedItems,
          reason,
          notes,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to submit return request.');
      }
      setSubmitted(true);
    } catch (err) {
      setApiError(err.message || 'Failed to submit return request.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.skeleton} />
          <div style={styles.skeleton} />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorBanner}>
            <p style={{ margin: '0 0 8px 0' }}>{loadError}</p>
            <Link to={`/account/orders/${id}`} style={{ color: '#f03e3e', fontSize: '14px' }}>← Back to order</Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.successPanel}>
            <div style={styles.successIcon}>✓</div>
            <h2 style={styles.successTitle}>Return request submitted</h2>
            <p style={styles.successSub}>Our team will review your request within 1–2 business days.</p>
            <Link to={`/account/orders/${id}`} style={{ color: '#4c6ef5', fontSize: '14px', textDecoration: 'none' }}>
              ← Back to order detail
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const items = order?.items || [];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to={`/account/orders/${id}`} style={styles.backLink}>← Back to order</Link>
        <h1 style={styles.pageTitle}>Return request</h1>
        <span style={styles.muted}>Return request</span>

        <form onSubmit={handleSubmit} noValidate>
          {/* Select items */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Select items to return</h2>
            {formErrors.items && <span style={styles.fieldError}>{formErrors.items}</span>}
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                style={{ ...styles.itemCheckRow, ...(idx === items.length - 1 ? { borderBottom: 'none' } : {}) }}
              >
                <input
                  type="checkbox"
                  id={`item-${item.id || idx}`}
                  checked={selectedItems.includes(item.id || idx)}
                  onChange={() => toggleItem(item.id || idx)}
                  style={{ width: '18px', height: '18px' }}
                />
                <label htmlFor={`item-${item.id || idx}`} style={{ flex: 1, cursor: 'pointer' }}>
                  <p style={styles.itemName}>{item.name || item.product_name}</p>
                  <p style={styles.itemMeta}>Qty: {item.quantity}</p>
                </label>
              </div>
            ))}
          </div>

          {/* Reason */}
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Reason for return</h2>
            <label htmlFor="reason" style={styles.label}>Select a reason</label>
            {formErrors.reason && <span style={styles.fieldError}>{formErrors.reason}</span>}
            <select
              id="reason"
              style={styles.select}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">— Select a reason —</option>
              {RETURN_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <label htmlFor="notes" style={styles.label}>Additional notes (optional)</label>
            <textarea
              id="notes"
              style={styles.textarea}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the issue in more detail…"
            />
          </div>

          {apiError && <div style={styles.errorBanner}>{apiError}</div>}

          <button type="submit" style={styles.btnPrimary} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit return request'}
          </button>
        </form>
      </div>
    </div>
  );
}
