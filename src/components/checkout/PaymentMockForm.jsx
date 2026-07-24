import React, { useState } from 'react';
import PropTypes from 'prop-types';

const OUTCOMES = [
  { value: 'success', label: 'Success — payment captured' },
  { value: 'failure', label: 'Failure — payment declined' },
  { value: 'pending', label: 'Pending — awaiting confirmation' },
];

const STATUS_CONFIG = {
  success: {
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    message: 'Payment successful! Your order has been placed.',
  },
  failure: {
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    message: 'Payment declined. Please try a different payment method.',
  },
  pending: {
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    message: 'Payment is pending. We will notify you once it is confirmed.',
  },
};

function PaymentMockForm({ onPaymentResult, loading }) {
  const [selectedOutcome, setSelectedOutcome] = useState('success');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const outcome = selectedOutcome;
    setResult(outcome);
    setSubmitting(false);

    if (onPaymentResult) {
      onPaymentResult({ outcome, mockCard: cardNumber.slice(-4) });
    }
  };

  const resultConfig = result ? STATUS_CONFIG[result] : null;

  return (
    <div className="payment-mock-form">
      <div className="payment-mock-form__test-banner">
        🧪 <strong>Test Mode</strong> — No real payment will be processed.
      </div>

      <form className="payment-mock-form__form" onSubmit={handleSubmit} noValidate>
        <div className="payment-mock-form__field">
          <label className="payment-mock-form__label" htmlFor="pmf-cardName">
            Name on Card
          </label>
          <input
            id="pmf-cardName"
            type="text"
            className="payment-mock-form__input"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="John Doe"
            autoComplete="cc-name"
          />
        </div>

        <div className="payment-mock-form__field">
          <label className="payment-mock-form__label" htmlFor="pmf-cardNumber">
            Card Number
          </label>
          <input
            id="pmf-cardNumber"
            type="text"
            inputMode="numeric"
            className="payment-mock-form__input payment-mock-form__input--mono"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="4242 4242 4242 4242"
            autoComplete="cc-number"
            maxLength={19}
          />
        </div>

        <div className="payment-mock-form__row">
          <div className="payment-mock-form__field">
            <label className="payment-mock-form__label" htmlFor="pmf-expiry">
              Expiry (MM/YY)
            </label>
            <input
              id="pmf-expiry"
              type="text"
              inputMode="numeric"
              className="payment-mock-form__input payment-mock-form__input--mono"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="12/27"
              autoComplete="cc-exp"
              maxLength={5}
            />
          </div>

          <div className="payment-mock-form__field">
            <label className="payment-mock-form__label" htmlFor="pmf-cvv">
              CVV
            </label>
            <input
              id="pmf-cvv"
              type="password"
              inputMode="numeric"
              className="payment-mock-form__input payment-mock-form__input--mono"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="•••"
              autoComplete="cc-csc"
              maxLength={4}
            />
          </div>
        </div>

        <fieldset className="payment-mock-form__outcome-group">
          <legend className="payment-mock-form__outcome-legend">
            Simulated Outcome
          </legend>
          {OUTCOMES.map((o) => (
            <label key={o.value} className="payment-mock-form__outcome-option">
              <input
                type="radio"
                name="mockOutcome"
                value={o.value}
                checked={selectedOutcome === o.value}
                onChange={() => setSelectedOutcome(o.value)}
              />
              <span>{o.label}</span>
            </label>
          ))}
        </fieldset>

        {resultConfig && (
          <div
            className="payment-mock-form__result"
            role="status"
            style={{
              background: resultConfig.bg,
              borderColor: resultConfig.border,
              color: resultConfig.color,
            }}
          >
            {resultConfig.message}
          </div>
        )}

        <button
          type="submit"
          className="payment-mock-form__submit"
          disabled={submitting || loading}
        >
          {submitting ? 'Processing…' : 'Pay Now (Test)'}
        </button>
      </form>

      <style>{`
        .payment-mock-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .payment-mock-form__test-banner {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.8125rem;
          color: #92400e;
        }
        .payment-mock-form__form {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }
        .payment-mock-form__row {
          display: flex;
          gap: 1rem;
        }
        .payment-mock-form__row .payment-mock-form__field {
          flex: 1;
        }
        .payment-mock-form__field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .payment-mock-form__label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }
        .payment-mock-form__input {
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.9375rem;
          color: #111827;
          background: #ffffff;
          outline: none;
          transition: border-color 0.15s;
        }
        .payment-mock-form__input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
        }
        .payment-mock-form__input--mono {
          font-family: 'Courier New', Courier, monospace;
          letter-spacing: 0.05em;
        }
        .payment-mock-form__outcome-group {
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          padding: 0.75rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .payment-mock-form__outcome-legend {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #6b7280;
          padding: 0 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .payment-mock-form__outcome-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #374151;
          cursor: pointer;
        }
        .payment-mock-form__result {
          padding: 0.625rem 0.875rem;
          border: 1px solid;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .payment-mock-form__submit {
          padding: 0.625rem 1.5rem;
          background: #2563eb;
          color: #ffffff;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
          align-self: flex-start;
        }
        .payment-mock-form__submit:hover:not(:disabled) {
          background: #1d4ed8;
        }
        .payment-mock-form__submit:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

PaymentMockForm.propTypes = {
  onPaymentResult: PropTypes.func,
  loading: PropTypes.bool,
};

PaymentMockForm.defaultProps = {
  onPaymentResult: null,
  loading: false,
};

export default PaymentMockForm;
