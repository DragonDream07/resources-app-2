import React, { useState } from 'react';
import checkIcon from '@/assets/icons/check.svg';

const PromoCodeInput = ({ appliedPromo, onApply, onRemove, isLoading }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleApply = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setError('Please enter a promo code.');
      return;
    }
    setError('');
    try {
      await onApply(trimmed);
      setCode('');
    } catch (err) {
      setError(err?.message || 'Invalid or expired promo code.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  const handleRemove = () => {
    setError('');
    setCode('');
    onRemove();
  };

  if (appliedPromo) {
    return (
      <div className="promo-code promo-code--applied">
        <div className="promo-code__applied-info">
          <img src={checkIcon} alt="" aria-hidden="true" className="promo-code__check-icon" />
          <div>
            <p className="promo-code__applied-label">
              Promo code <strong>{appliedPromo.code}</strong> applied
            </p>
            {appliedPromo.discount != null && (
              <p className="promo-code__applied-discount">
                You save ₹{Number(appliedPromo.discount).toFixed(2)}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          className="promo-code__remove-btn"
          onClick={handleRemove}
          aria-label="Remove promo code"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="promo-code">
      <label htmlFor="promo-code-input" className="promo-code__label">
        Have a promo code?
      </label>
      <div className="promo-code__input-row">
        <input
          id="promo-code-input"
          type="text"
          className={`promo-code__input${error ? ' promo-code__input--error' : ''}`}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter promo code"
          disabled={isLoading}
          aria-describedby={error ? 'promo-code-error' : undefined}
          autoComplete="off"
        />
        <button
          type="button"
          className="promo-code__apply-btn btn btn--secondary"
          onClick={handleApply}
          disabled={isLoading || !code.trim()}
        >
          {isLoading ? 'Applying…' : 'Apply'}
        </button>
      </div>
      {error && (
        <p id="promo-code-error" className="promo-code__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default PromoCodeInput;
