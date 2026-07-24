import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoSrc from '@/assets/images/logo.svg';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 16px',
  },
  container: {
    width: '100%',
    maxWidth: '480px',
  },
  logoWrap: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  logo: {
    height: '40px',
    width: 'auto',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px 32px',
    boxShadow: '0 2px 12px rgba(33,37,41,0.1)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subheading: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    marginBottom: '28px',
    textAlign: 'center',
  },
  benefitsList: {
    backgroundColor: '#e8ecfd',
    borderRadius: '6px',
    padding: '16px 20px',
    marginBottom: '24px',
    listStyle: 'none',
    margin: '0 0 24px 0',
  },
  benefitItem: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '22px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },
  benefitCheck: {
    color: '#37b24d',
    fontWeight: '700',
    flexShrink: 0,
    marginTop: '1px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '16px',
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
    transition: 'border-color 0.15s',
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
  passwordHint: {
    fontSize: '12px',
    color: '#495057',
    lineHeight: '16px',
    marginTop: '2px',
  },
  submitBtn: {
    display: 'block',
    width: '100%',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '10px',
    padding: '13px 32px',
    cursor: 'pointer',
    minHeight: '44px',
    marginTop: '8px',
    transition: 'background-color 0.15s',
    boxSizing: 'border-box',
  },
  submitBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  skipLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '14px',
    color: '#4c6ef5',
    textDecoration: 'underline',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    width: '100%',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  divider: {
    textAlign: 'center',
    margin: '20px 0',
    fontSize: '13px',
    color: '#868e96',
    position: 'relative',
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
  successBanner: {
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
    lineHeight: '20px',
    fontWeight: '500',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#495057',
  },
  loginLinkAnchor: {
    color: '#4c6ef5',
    textDecoration: 'underline',
    fontWeight: '500',
  },
};

const BENEFITS = [
  'Track this order and all future orders in one place.',
  'Faster checkout with saved addresses and payment methods.',
  'Exclusive member-only offers and early access to sales.',
  'Hassle-free returns and order history at your fingertips.',
];

function validateForm(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Full name is required.';
  if (!form.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!form.password) {
    errors.password = 'Password is required.';
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  return errors;
}

export default function GuestPostCheckoutRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/guest-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.message || 'Registration failed. Please try again.');
        return;
      }
      if (data.data?.token || data.token) {
        const token = data.data?.token || data.token;
        try { localStorage.setItem('authToken', token); } catch { /* ignore */ }
      }
      setSuccess(true);
      setTimeout(() => navigate('/'), 2500);
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleSkip() {
    navigate('/');
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.logoWrap}>
          <img src={logoSrc} alt="Store Logo" style={styles.logo} />
        </div>

        <div style={styles.card}>
          <h1 style={styles.heading}>Save your order history</h1>
          <p style={styles.subheading}>
            Your order is confirmed! Create a free account to manage it and enjoy a faster experience next time.
          </p>

          <ul style={styles.benefitsList}>
            {BENEFITS.map((benefit) => (
              <li key={benefit} style={styles.benefitItem}>
                <span style={styles.benefitCheck}>✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          {success && (
            <div style={styles.successBanner} role="status">
              ✓ Account created! Redirecting you to the home page…
            </div>
          )}

          {apiError && !success && (
            <div style={styles.alertError} role="alert">{apiError}</div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} noValidate>
              <div style={styles.formGroup}>
                <label htmlFor="name" style={styles.label}>Full Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(fieldErrors.name ? styles.inputError : {}) }}
                  aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                />
                {fieldErrors.name && <span id="name-error" style={styles.errorText} role="alert">{fieldErrors.name}</span>}
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(fieldErrors.email ? styles.inputError : {}) }}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                />
                {fieldErrors.email && <span id="email-error" style={styles.errorText} role="alert">{fieldErrors.email}</span>}
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>Password *</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(fieldErrors.password ? styles.inputError : {}) }}
                  aria-describedby={fieldErrors.password ? 'password-error' : 'password-hint'}
                />
                {fieldErrors.password
                  ? <span id="password-error" style={styles.errorText} role="alert">{fieldErrors.password}</span>
                  : <span id="password-hint" style={styles.passwordHint}>Minimum 8 characters.</span>
                }
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="confirmPassword" style={styles.label}>Confirm Password *</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(fieldErrors.confirmPassword ? styles.inputError : {}) }}
                  aria-describedby={fieldErrors.confirmPassword ? 'confirmPassword-error' : undefined}
                />
                {fieldErrors.confirmPassword && (
                  <span id="confirmPassword-error" style={styles.errorText} role="alert">{fieldErrors.confirmPassword}</span>
                )}
              </div>

              <button
                type="submit"
                style={{ ...styles.submitBtn, ...(submitting ? styles.submitBtnDisabled : {}) }}
                disabled={submitting}
              >
                {submitting ? 'Creating Account…' : 'Create Account'}
              </button>
            </form>
          )}

          <button type="button" style={styles.skipLink} onClick={handleSkip}>
            No thanks, continue as guest
          </button>

          <div style={styles.loginLink}>
            Already have an account?{' '}
            <Link to="/login" style={styles.loginLinkAnchor}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
