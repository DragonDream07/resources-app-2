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
  savedAddressList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  savedAddressItem: {
    border: '2px solid #868e96',
    borderRadius: '6px',
    padding: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    transition: 'border-color 0.15s',
  },
  savedAddressItemSelected: {
    border: '2px solid #4c6ef5',
    backgroundColor: '#e8ecfd',
  },
  radioInput: {
    marginTop: '3px',
    accentColor: '#4c6ef5',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  addressText: {
    fontSize: '14px',
    color: '#212529',
    lineHeight: '20px',
  },
  addressName: {
    fontWeight: '600',
    marginBottom: '2px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
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
    transition: 'border-color 0.15s',
    width: '100%',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#f03e3e',
    backgroundColor: '#ffe3e3',
  },
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    lineHeight: '16px',
    marginTop: '2px',
  },
  pinRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
  },
  pinInputWrap: {
    flex: 1,
  },
  checkBtn: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 16px',
    cursor: 'pointer',
    height: '44px',
    minWidth: '100px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  checkBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  serviceabilityMsg: {
    marginTop: '6px',
    fontSize: '14px',
    lineHeight: '20px',
  },
  serviceabilityOk: {
    color: '#37b24d',
    fontWeight: '500',
  },
  serviceabilityFail: {
    color: '#f03e3e',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #dee2e6',
    margin: '20px 0',
  },
  toggleNewAddress: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4c6ef5',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    textDecoration: 'underline',
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '24px',
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
};

const STEP_LABELS = ['Address', 'Payment', 'Review'];

function StepIndicator({ current }) {
  return (
    <div style={styles.stepIndicator}>
      {STEP_LABELS.map((label, idx) => (
        <>
          <div key={label} style={styles.stepItem}>
            <div style={{ ...styles.stepCircle, ...(idx === current - 1 ? styles.stepCircleActive : {}) }}>
              {idx + 1}
            </div>
            <span style={idx === current - 1 ? { ...styles.stepItem, ...styles.stepActive } : styles.stepItem}>
              {label}
            </span>
          </div>
          {idx < STEP_LABELS.length - 1 && <div key={`div-${idx}`} style={styles.stepDivider} />}
        </>
      ))}
    </div>
  );
}

const EMPTY_FORM = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pinCode: '',
  country: 'India',
};

function validateForm(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!form.phone.trim()) errors.phone = 'Phone number is required.';
  else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) errors.phone = 'Enter a valid 10-digit mobile number.';
  if (!form.addressLine1.trim()) errors.addressLine1 = 'Address line 1 is required.';
  if (!form.city.trim()) errors.city = 'City is required.';
  if (!form.state.trim()) errors.state = 'State is required.';
  if (!form.pinCode.trim()) errors.pinCode = 'PIN code is required.';
  else if (!/^\d{6}$/.test(form.pinCode.trim())) errors.pinCode = 'Enter a valid 6-digit PIN code.';
  if (!form.country.trim()) errors.country = 'Country is required.';
  return errors;
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

export default function CheckoutAddress() {
  const navigate = useNavigate();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serviceability, setServiceability] = useState(null);
  const [checkingPin, setCheckingPin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const token = getAuthToken();

  useEffect(() => {
    if (token) {
      fetch('/api/users/me/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          const list = Array.isArray(data.data) ? data.data : [];
          setSavedAddresses(list);
          if (list.length > 0) {
            setSelectedAddressId(list[0].id);
          } else {
            setShowNewForm(true);
          }
        })
        .catch(() => setShowNewForm(true));
    } else {
      setShowNewForm(true);
    }
  }, [token]);

  function handleFieldChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === 'pinCode') setServiceability(null);
  }

  async function handleCheckServiceability() {
    if (!/^\d{6}$/.test(form.pinCode.trim())) {
      setFieldErrors((prev) => ({ ...prev, pinCode: 'Enter a valid 6-digit PIN code.' }));
      return;
    }
    setCheckingPin(true);
    setServiceability(null);
    try {
      const res = await fetch(`/api/serviceability?pinCode=${form.pinCode.trim()}`);
      const data = await res.json();
      setServiceability(data.serviceable ? 'ok' : 'fail');
    } catch {
      setServiceability('fail');
    } finally {
      setCheckingPin(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');

    if (selectedAddressId && !showNewForm) {
      setSubmitting(true);
      try {
        const res = await fetch('/api/checkout/address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ addressId: selectedAddressId }),
        });
        if (!res.ok) {
          const err = await res.json();
          setApiError(err.message || 'Failed to save address. Please try again.');
          return;
        }
        navigate('/checkout/payment');
      } catch {
        setApiError('Network error. Please try again.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (serviceability !== 'ok') {
      setFieldErrors((prev) => ({ ...prev, pinCode: 'Please verify PIN code serviceability before proceeding.' }));
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pinCode: form.pinCode.trim(),
        country: form.country.trim(),
      };
      const res = await fetch('/api/checkout/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        setApiError(err.message || 'Failed to save address. Please try again.');
        return;
      }
      navigate('/checkout/payment');
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = !submitting && (selectedAddressId || (serviceability === 'ok'));

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <StepIndicator current={1} />
        <h1 style={styles.heading}>Delivery Address</h1>

        {apiError && <div style={styles.alertError} role="alert">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {savedAddresses.length > 0 && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>Saved Addresses</div>
              <div style={styles.savedAddressList}>
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    style={{
                      ...styles.savedAddressItem,
                      ...(selectedAddressId === addr.id && !showNewForm ? styles.savedAddressItemSelected : {}),
                    }}
                    onClick={() => { setSelectedAddressId(addr.id); setShowNewForm(false); }}
                    role="radio"
                    aria-checked={selectedAddressId === addr.id && !showNewForm}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setSelectedAddressId(addr.id); setShowNewForm(false); } }}
                  >
                    <input
                      type="radio"
                      name="savedAddress"
                      value={addr.id}
                      checked={selectedAddressId === addr.id && !showNewForm}
                      onChange={() => { setSelectedAddressId(addr.id); setShowNewForm(false); }}
                      style={styles.radioInput}
                      aria-label={`Select address: ${addr.fullName}`}
                    />
                    <div style={styles.addressText}>
                      <div style={styles.addressName}>{addr.fullName}</div>
                      <div>{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</div>
                      <div>{addr.city}, {addr.state} - {addr.pinCode}</div>
                      <div>{addr.country}</div>
                      {addr.phone && <div>Phone: {addr.phone}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                style={styles.toggleNewAddress}
                onClick={() => { setShowNewForm(!showNewForm); setSelectedAddressId(null); }}
              >
                {showNewForm ? 'Cancel — use saved address' : '+ Add a new address'}
              </button>
            </div>
          )}

          {showNewForm && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>New Delivery Address</div>
              <div style={styles.formGrid}>
                <div style={{ ...styles.formGroup, ...styles.formGridFull }}>
                  <label htmlFor="fullName" style={styles.label}>Full Name *</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={handleFieldChange}
                    style={{ ...styles.input, ...(fieldErrors.fullName ? styles.inputError : {}) }}
                    aria-describedby={fieldErrors.fullName ? 'fullName-error' : undefined}
                  />
                  {fieldErrors.fullName && <span id="fullName-error" style={styles.errorText} role="alert">{fieldErrors.fullName}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="phone" style={styles.label}>Phone *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleFieldChange}
                    style={{ ...styles.input, ...(fieldErrors.phone ? styles.inputError : {}) }}
                    aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                  />
                  {fieldErrors.phone && <span id="phone-error" style={styles.errorText} role="alert">{fieldErrors.phone}</span>}
                </div>

                <div style={{ ...styles.formGroup, ...styles.formGridFull }}>
                  <label htmlFor="addressLine1" style={styles.label}>Address Line 1 *</label>
                  <input
                    id="addressLine1"
                    name="addressLine1"
                    type="text"
                    autoComplete="address-line1"
                    value={form.addressLine1}
                    onChange={handleFieldChange}
                    style={{ ...styles.input, ...(fieldErrors.addressLine1 ? styles.inputError : {}) }}
                    aria-describedby={fieldErrors.addressLine1 ? 'addressLine1-error' : undefined}
                  />
                  {fieldErrors.addressLine1 && <span id="addressLine1-error" style={styles.errorText} role="alert">{fieldErrors.addressLine1}</span>}
                </div>

                <div style={{ ...styles.formGroup, ...styles.formGridFull }}>
                  <label htmlFor="addressLine2" style={styles.label}>Address Line 2</label>
                  <input
                    id="addressLine2"
                    name="addressLine2"
                    type="text"
                    autoComplete="address-line2"
                    value={form.addressLine2}
                    onChange={handleFieldChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="city" style={styles.label}>City *</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={handleFieldChange}
                    style={{ ...styles.input, ...(fieldErrors.city ? styles.inputError : {}) }}
                    aria-describedby={fieldErrors.city ? 'city-error' : undefined}
                  />
                  {fieldErrors.city && <span id="city-error" style={styles.errorText} role="alert">{fieldErrors.city}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="state" style={styles.label}>State *</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    autoComplete="address-level1"
                    value={form.state}
                    onChange={handleFieldChange}
                    style={{ ...styles.input, ...(fieldErrors.state ? styles.inputError : {}) }}
                    aria-describedby={fieldErrors.state ? 'state-error' : undefined}
                  />
                  {fieldErrors.state && <span id="state-error" style={styles.errorText} role="alert">{fieldErrors.state}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="pinCode" style={styles.label}>PIN Code *</label>
                  <div style={styles.pinRow}>
                    <div style={{ ...styles.pinInputWrap, ...styles.formGroup }}>
                      <input
                        id="pinCode"
                        name="pinCode"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        autoComplete="postal-code"
                        value={form.pinCode}
                        onChange={handleFieldChange}
                        style={{ ...styles.input, ...(fieldErrors.pinCode ? styles.inputError : {}) }}
                        aria-describedby={fieldErrors.pinCode ? 'pinCode-error' : 'pinCode-hint'}
                      />
                      {serviceability === 'ok' && (
                        <span style={{ ...styles.serviceabilityMsg, ...styles.serviceabilityOk }} id="pinCode-hint" role="status">
                          ✓ Delivery available
                        </span>
                      )}
                      {serviceability === 'fail' && (
                        <span style={{ ...styles.serviceabilityMsg, ...styles.serviceabilityFail }} id="pinCode-hint" role="alert">
                          Delivery not available to this PIN code.
                        </span>
                      )}
                      {fieldErrors.pinCode && <span id="pinCode-error" style={styles.errorText} role="alert">{fieldErrors.pinCode}</span>}
                    </div>
                    <button
                      type="button"
                      style={{
                        ...styles.checkBtn,
                        ...(checkingPin || !/^\d{6}$/.test(form.pinCode) ? styles.checkBtnDisabled : {}),
                      }}
                      onClick={handleCheckServiceability}
                      disabled={checkingPin || !/^\d{6}$/.test(form.pinCode)}
                      aria-label="Check PIN code serviceability"
                    >
                      {checkingPin ? 'Checking…' : 'Check'}
                    </button>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="country" style={styles.label}>Country *</label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    autoComplete="country-name"
                    value={form.country}
                    onChange={handleFieldChange}
                    style={{ ...styles.input, ...(fieldErrors.country ? styles.inputError : {}) }}
                    aria-describedby={fieldErrors.country ? 'country-error' : undefined}
                  />
                  {fieldErrors.country && <span id="country-error" style={styles.errorText} role="alert">{fieldErrors.country}</span>}
                </div>
              </div>
            </div>
          )}

          <div style={styles.actionsRow}>
            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                ...(!canSubmit ? styles.submitBtnDisabled : {}),
              }}
              disabled={!canSubmit}
            >
              {submitting ? 'Saving…' : 'Continue to Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
