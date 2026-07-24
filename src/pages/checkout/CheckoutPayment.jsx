import { useState } from 'react';
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
  testModeBanner: {
    backgroundColor: '#fff3e6',
    border: '1px solid #fd7e14',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#495057',
    marginBottom: '20px',
    lineHeight: '20px',
  },
  testModeBannerTitle: {
    fontWeight: '600',
    color: '#fd7e14',
    marginBottom: '4px',
    fontSize: '14px',
  },
  methodList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  methodItem: {
    border: '2px solid #868e96',
    borderRadius: '6px',
    padding: '14px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'border-color 0.15s',
  },
  methodItemSelected: {
    border: '2px solid #4c6ef5',
    backgroundColor: '#e8ecfd',
  },
  radioInput: {
    accentColor: '#4c6ef5',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  methodLabel: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#212529',
  },
  methodDesc: {
    fontSize: '12px',
    color: '#495057',
    marginTop: '2px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginTop: '16px',
  },
  formGridFull: {
    gridColumn: '1 / -1',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#495057',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    lineHeight: '16px',
  },
  input: {
    fontSize: '16px',
    fontWeight: '400',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '10px 12px',
    outline: 'none',
    lineHeight: '24px',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  },
  inputError: {
    borderColor: '#f03e3e',
    backgroundColor: '#ffe3e3',
  },
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    lineHeight: '16px',
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
  submitBtn: {
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
  submitBtnDisabled: {
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
  infoText: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
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

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex, Rupay' },
  { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm, BHIM' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay at the time of delivery' },
];

const TEST_CARDS = [
  { number: '4111 1111 1111 1111', result: 'Success' },
  { number: '4000 0000 0000 0002', result: 'Decline' },
];

function validateCard(card) {
  const errors = {};
  if (!card.number.replace(/\s/g, '').match(/^\d{16}$/)) errors.number = 'Enter a valid 16-digit card number.';
  if (!card.name.trim()) errors.name = 'Cardholder name is required.';
  if (!card.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) errors.expiry = 'Enter expiry as MM/YY.';
  if (!card.cvv.match(/^\d{3,4}$/)) errors.cvv = 'Enter a valid CVV.';
  return errors;
}

function validateUpi(upiId) {
  if (!upiId.trim()) return 'UPI ID is required.';
  if (!upiId.includes('@')) return 'Enter a valid UPI ID (e.g. name@upi).';
  return '';
}

function getAuthToken() {
  try {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  } catch {
    return null;
  }
}

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const [cardErrors, setCardErrors] = useState({});
  const [upiError, setUpiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const token = getAuthToken();

  function handleCardChange(e) {
    const { name, value } = e.target;
    let formatted = value;
    if (name === 'number') {
      formatted = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    if (name === 'expiry') {
      formatted = value.replace(/\D/g, '').slice(0, 4);
      if (formatted.length > 2) formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
    }
    if (name === 'cvv') {
      formatted = value.replace(/\D/g, '').slice(0, 4);
    }
    setCard((prev) => ({ ...prev, [name]: formatted }));
    if (cardErrors[name]) setCardErrors((prev) => ({ ...prev, [name]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');

    if (method === 'card') {
      const errors = validateCard(card);
      if (Object.keys(errors).length > 0) {
        setCardErrors(errors);
        return;
      }
    }
    if (method === 'upi') {
      const err = validateUpi(upiId);
      if (err) { setUpiError(err); return; }
    }

    setSubmitting(true);
    try {
      const payload = {
        method,
        ...(method === 'card' ? {
          cardNumber: card.number.replace(/\s/g, ''),
          cardName: card.name,
          cardExpiry: card.expiry,
          cardCvv: card.cvv,
        } : {}),
        ...(method === 'upi' ? { upiId } : {}),
      };
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        setApiError(err.message || 'Payment initiation failed. Please try again.');
        return;
      }
      navigate('/checkout/review');
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <StepIndicator current={2} />
        <h1 style={styles.heading}>Payment</h1>

        <div style={styles.testModeBanner} role="note">
          <div style={styles.testModeBannerTitle}>⚠ Test Mode</div>
          <div>Use test card <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: '600' }}>{TEST_CARDS[0].number}</span> for a successful payment, or <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: '600' }}>{TEST_CARDS[1].number}</span> to simulate a decline. Any future expiry and any 3-digit CVV are valid.</div>
        </div>

        {apiError && <div style={styles.alertError} role="alert">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Select Payment Method</div>
            <div style={styles.methodList}>
              {PAYMENT_METHODS.map((pm) => (
                <div
                  key={pm.id}
                  style={{
                    ...styles.methodItem,
                    ...(method === pm.id ? styles.methodItemSelected : {}),
                  }}
                  onClick={() => { setMethod(pm.id); setApiError(''); }}
                  role="radio"
                  aria-checked={method === pm.id}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setMethod(pm.id); }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.id}
                    checked={method === pm.id}
                    onChange={() => setMethod(pm.id)}
                    style={styles.radioInput}
                    aria-label={pm.label}
                  />
                  <div>
                    <div style={styles.methodLabel}>{pm.label}</div>
                    <div style={styles.methodDesc}>{pm.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {method === 'card' && (
              <div style={styles.formGrid}>
                <div style={{ ...styles.formGroup, ...styles.formGridFull }}>
                  <label htmlFor="cardNumber" style={styles.label}>Card Number *</label>
                  <input
                    id="cardNumber"
                    name="number"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 5678 9012 3456"
                    value={card.number}
                    onChange={handleCardChange}
                    style={{ ...styles.input, ...(cardErrors.number ? styles.inputError : {}) }}
                    aria-describedby={cardErrors.number ? 'cardNumber-error' : undefined}
                  />
                  {cardErrors.number && <span id="cardNumber-error" style={styles.errorText} role="alert">{cardErrors.number}</span>}
                </div>

                <div style={{ ...styles.formGroup, ...styles.formGridFull }}>
                  <label htmlFor="cardName" style={styles.label}>Cardholder Name *</label>
                  <input
                    id="cardName"
                    name="name"
                    type="text"
                    autoComplete="cc-name"
                    placeholder="Name on card"
                    value={card.name}
                    onChange={handleCardChange}
                    style={{ ...styles.input, ...(cardErrors.name ? styles.inputError : {}), fontFamily: "'Inter', sans-serif" }}
                    aria-describedby={cardErrors.name ? 'cardName-error' : undefined}
                  />
                  {cardErrors.name && <span id="cardName-error" style={styles.errorText} role="alert">{cardErrors.name}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="cardExpiry" style={styles.label}>Expiry (MM/YY) *</label>
                  <input
                    id="cardExpiry"
                    name="expiry"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={handleCardChange}
                    style={{ ...styles.input, ...(cardErrors.expiry ? styles.inputError : {}) }}
                    aria-describedby={cardErrors.expiry ? 'cardExpiry-error' : undefined}
                  />
                  {cardErrors.expiry && <span id="cardExpiry-error" style={styles.errorText} role="alert">{cardErrors.expiry}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="cardCvv" style={styles.label}>CVV *</label>
                  <input
                    id="cardCvv"
                    name="cvv"
                    type="password"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="•••"
                    value={card.cvv}
                    onChange={handleCardChange}
                    style={{ ...styles.input, ...(cardErrors.cvv ? styles.inputError : {}) }}
                    aria-describedby={cardErrors.cvv ? 'cardCvv-error' : undefined}
                  />
                  {cardErrors.cvv && <span id="cardCvv-error" style={styles.errorText} role="alert">{cardErrors.cvv}</span>}
                </div>
              </div>
            )}

            {method === 'upi' && (
              <div style={{ marginTop: '16px' }}>
                <div style={styles.formGroup}>
                  <label htmlFor="upiId" style={styles.label}>UPI ID *</label>
                  <input
                    id="upiId"
                    name="upiId"
                    type="text"
                    autoComplete="off"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => { setUpiId(e.target.value); setUpiError(''); }}
                    style={{ ...styles.input, ...(upiError ? styles.inputError : {}), fontFamily: "'Inter', sans-serif" }}
                    aria-describedby={upiError ? 'upiId-error' : undefined}
                  />
                  {upiError && <span id="upiId-error" style={styles.errorText} role="alert">{upiError}</span>}
                </div>
              </div>
            )}

            {method === 'cod' && (
              <div style={{ marginTop: '16px' }}>
                <p style={styles.infoText}>
                  You will pay in cash when your order is delivered. A nominal COD fee may apply and will be shown in the order summary.
                </p>
              </div>
            )}
          </div>

          <div style={styles.actionsRow}>
            <button type="button" style={styles.backBtn} onClick={() => navigate('/checkout/address')}>
              ← Back to Address
            </button>
            <button
              type="submit"
              style={{ ...styles.submitBtn, ...(submitting ? styles.submitBtnDisabled : {}) }}
              disabled={submitting}
            >
              {submitting ? 'Processing…' : 'Continue to Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
