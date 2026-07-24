import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const PIN_REGEX = /^[1-9][0-9]{5}$/;

const INITIAL_ERRORS = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pinCode: '',
};

function AddressForm({ initialValues, onSubmit, onCheckServiceability, loading }) {
  const [values, setValues] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
    ...initialValues,
  });

  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [serviceability, setServiceability] = useState(null); // null | 'checking' | 'serviceable' | 'not_serviceable'
  const [pinDebounceTimer, setPinDebounceTimer] = useState(null);

  const validate = (fieldValues = values) => {
    const errs = { ...errors };

    if ('fullName' in fieldValues) {
      errs.fullName = fieldValues.fullName.trim() ? '' : 'Full name is required.';
    }
    if ('phone' in fieldValues) {
      errs.phone = /^[6-9]\d{9}$/.test(fieldValues.phone.trim())
        ? ''
        : 'Enter a valid 10-digit Indian mobile number.';
    }
    if ('addressLine1' in fieldValues) {
      errs.addressLine1 = fieldValues.addressLine1.trim() ? '' : 'Address line 1 is required.';
    }
    if ('city' in fieldValues) {
      errs.city = fieldValues.city.trim() ? '' : 'City is required.';
    }
    if ('state' in fieldValues) {
      errs.state = fieldValues.state.trim() ? '' : 'State is required.';
    }
    if ('pinCode' in fieldValues) {
      errs.pinCode = PIN_REGEX.test(fieldValues.pinCode.trim()) ? '' : 'Enter a valid 6-digit PIN code.';
    }

    setErrors(errs);
    return Object.values(errs).every((e) => !e);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...values, [name]: value };
    setValues(updated);
    validate({ [name]: value });
  };

  const checkPin = useCallback(
    async (pin) => {
      if (!PIN_REGEX.test(pin)) return;
      setServiceability('checking');
      try {
        const result = await onCheckServiceability(pin);
        setServiceability(result ? 'serviceable' : 'not_serviceable');
      } catch {
        setServiceability(null);
      }
    },
    [onCheckServiceability]
  );

  useEffect(() => {
    if (pinDebounceTimer) clearTimeout(pinDebounceTimer);
    if (!PIN_REGEX.test(values.pinCode)) {
      setServiceability(null);
      return;
    }
    const timer = setTimeout(() => {
      checkPin(values.pinCode);
    }, 600);
    setPinDebounceTimer(timer);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.pinCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
    }
  };

  return (
    <form className="address-form" onSubmit={handleSubmit} noValidate>
      <div className="address-form__row">
        <div className="address-form__field">
          <label className="address-form__label" htmlFor="af-fullName">
            Full Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="af-fullName"
            name="fullName"
            type="text"
            className={`address-form__input${errors.fullName ? ' address-form__input--error' : ''}`}
            value={values.fullName}
            onChange={handleChange}
            autoComplete="name"
            placeholder="John Doe"
          />
          {errors.fullName && (
            <span className="address-form__error" role="alert">{errors.fullName}</span>
          )}
        </div>

        <div className="address-form__field">
          <label className="address-form__label" htmlFor="af-phone">
            Mobile Number <span aria-hidden="true">*</span>
          </label>
          <input
            id="af-phone"
            name="phone"
            type="tel"
            className={`address-form__input${errors.phone ? ' address-form__input--error' : ''}`}
            value={values.phone}
            onChange={handleChange}
            autoComplete="tel"
            placeholder="9876543210"
            maxLength={10}
          />
          {errors.phone && (
            <span className="address-form__error" role="alert">{errors.phone}</span>
          )}
        </div>
      </div>

      <div className="address-form__field">
        <label className="address-form__label" htmlFor="af-addressLine1">
          Address Line 1 <span aria-hidden="true">*</span>
        </label>
        <input
          id="af-addressLine1"
          name="addressLine1"
          type="text"
          className={`address-form__input${errors.addressLine1 ? ' address-form__input--error' : ''}`}
          value={values.addressLine1}
          onChange={handleChange}
          autoComplete="address-line1"
          placeholder="House No, Street, Area"
        />
        {errors.addressLine1 && (
          <span className="address-form__error" role="alert">{errors.addressLine1}</span>
        )}
      </div>

      <div className="address-form__field">
        <label className="address-form__label" htmlFor="af-addressLine2">
          Address Line 2
        </label>
        <input
          id="af-addressLine2"
          name="addressLine2"
          type="text"
          className="address-form__input"
          value={values.addressLine2}
          onChange={handleChange}
          autoComplete="address-line2"
          placeholder="Landmark (optional)"
        />
      </div>

      <div className="address-form__row">
        <div className="address-form__field">
          <label className="address-form__label" htmlFor="af-city">
            City <span aria-hidden="true">*</span>
          </label>
          <input
            id="af-city"
            name="city"
            type="text"
            className={`address-form__input${errors.city ? ' address-form__input--error' : ''}`}
            value={values.city}
            onChange={handleChange}
            autoComplete="address-level2"
            placeholder="Mumbai"
          />
          {errors.city && (
            <span className="address-form__error" role="alert">{errors.city}</span>
          )}
        </div>

        <div className="address-form__field">
          <label className="address-form__label" htmlFor="af-state">
            State <span aria-hidden="true">*</span>
          </label>
          <input
            id="af-state"
            name="state"
            type="text"
            className={`address-form__input${errors.state ? ' address-form__input--error' : ''}`}
            value={values.state}
            onChange={handleChange}
            autoComplete="address-level1"
            placeholder="Maharashtra"
          />
          {errors.state && (
            <span className="address-form__error" role="alert">{errors.state}</span>
          )}
        </div>

        <div className="address-form__field">
          <label className="address-form__label" htmlFor="af-pinCode">
            PIN Code <span aria-hidden="true">*</span>
          </label>
          <input
            id="af-pinCode"
            name="pinCode"
            type="text"
            className={`address-form__input${errors.pinCode ? ' address-form__input--error' : ''}`}
            value={values.pinCode}
            onChange={handleChange}
            autoComplete="postal-code"
            placeholder="400001"
            maxLength={6}
          />
          {errors.pinCode && (
            <span className="address-form__error" role="alert">{errors.pinCode}</span>
          )}
          {serviceability === 'checking' && (
            <span className="address-form__serviceability address-form__serviceability--checking">
              Checking serviceability…
            </span>
          )}
          {serviceability === 'serviceable' && (
            <span className="address-form__serviceability address-form__serviceability--ok" role="status">
              ✓ Delivery available to this PIN code.
            </span>
          )}
          {serviceability === 'not_serviceable' && (
            <span className="address-form__serviceability address-form__serviceability--fail" role="alert">
              ✗ Sorry, we do not deliver to this PIN code.
            </span>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="address-form__submit"
        disabled={loading || serviceability === 'not_serviceable'}
      >
        {loading ? 'Saving…' : 'Save & Continue'}
      </button>

      <style>{`
        .address-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .address-form__row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .address-form__row .address-form__field {
          flex: 1 1 160px;
        }
        .address-form__field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .address-form__label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }
        .address-form__label span {
          color: #ef4444;
        }
        .address-form__input {
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.9375rem;
          color: #111827;
          outline: none;
          transition: border-color 0.15s;
          background: #ffffff;
        }
        .address-form__input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
        }
        .address-form__input--error {
          border-color: #ef4444;
        }
        .address-form__error {
          font-size: 0.75rem;
          color: #ef4444;
        }
        .address-form__serviceability {
          font-size: 0.75rem;
          margin-top: 0.125rem;
        }
        .address-form__serviceability--checking {
          color: #6b7280;
        }
        .address-form__serviceability--ok {
          color: #16a34a;
        }
        .address-form__serviceability--fail {
          color: #ef4444;
        }
        .address-form__submit {
          align-self: flex-start;
          padding: 0.625rem 1.5rem;
          background: #2563eb;
          color: #ffffff;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .address-form__submit:hover:not(:disabled) {
          background: #1d4ed8;
        }
        .address-form__submit:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}

AddressForm.propTypes = {
  initialValues: PropTypes.shape({
    fullName: PropTypes.string,
    phone: PropTypes.string,
    addressLine1: PropTypes.string,
    addressLine2: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    pinCode: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCheckServiceability: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

AddressForm.defaultProps = {
  initialValues: {},
  loading: false,
};

export default AddressForm;
