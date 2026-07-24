import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtext: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#495057',
    textAlign: 'center',
    marginBottom: '32px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#212529',
    marginBottom: '6px',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    minHeight: '44px',
  },
  inputError: {
    borderColor: '#f03e3e',
  },
  fieldError: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '4px',
    lineHeight: '16px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    color: '#f03e3e',
    fontSize: '14px',
    lineHeight: '20px',
  },
  warningBanner: {
    backgroundColor: '#fff4e6',
    border: '1px solid #fd7e14',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    color: '#343a40',
    fontSize: '14px',
    lineHeight: '20px',
  },
  submitBtn: {
    display: 'block',
    width: '100%',
    padding: '12px 24px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    minHeight: '44px',
    marginTop: '8px',
  },
  submitBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  loginRow: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#495057',
  },
  loginLink: {
    color: '#4c6ef5',
    fontWeight: '500',
    textDecoration: 'none',
    marginLeft: '4px',
  },
};

function validateEmail(value) {
  if (!value) return 'Enter a valid email address.';
  if (value.length > 320) return 'Enter a valid email address.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) return 'Enter a valid email address.';
  return null;
}

function validateFullName(value) {
  if (value && value.length > 255) return 'Full name must not exceed 255 characters.';
  return null;
}

function validatePhone(value) {
  if (value && value.length > 30) return 'Enter a valid phone number.';
  return null;
}

function validatePassword(value) {
  if (!value || value.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

function validateConfirm(value, password) {
  if (value !== password) return 'Passwords do not match.';
  return null;
}

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [bannerError, setBannerError] = useState(null);
  const [rateLimitWarning, setRateLimitWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const validate = () => {
    const errs = {};
    const fullNameErr = validateFullName(fullName);
    if (fullNameErr) errs.full_name = fullNameErr;
    const emailErr = validateEmail(email);
    if (emailErr) errs.email = emailErr;
    const phoneErr = validatePhone(phone);
    if (phoneErr) errs.phone = phoneErr;
    const passwordErr = validatePassword(password);
    if (passwordErr) errs.password = passwordErr;
    const confirmErr = validateConfirm(confirm, password);
    if (confirmErr) errs.confirm = confirmErr;
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBannerError(null);
    setRateLimitWarning(false);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const body = { email, password };
      if (fullName) body.full_name = fullName;
      if (phone) body.phone = phone;

      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 429) {
        setRateLimitWarning(true);
        setLoading(false);
        return;
      }

      if (res.status === 409) {
        setBannerError('email_exists');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        showToast('Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      navigate('/');
    } catch {
      showToast('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {toast && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#212529',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '10px',
            fontSize: '14px',
            zIndex: 1000,
            whiteSpace: 'nowrap',
          }}
        >
          {toast}
        </div>
      )}
      <div style={styles.card}>
        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.subtext}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4c6ef5', fontWeight: '500' }}>
            Log in
          </Link>
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {bannerError === 'email_exists' && (
            <div role="alert" style={styles.errorBanner}>
              An account with this email already exists.{' '}
              <Link to="/login" style={{ color: '#f03e3e', fontWeight: '600' }}>
                Log in instead?
              </Link>
            </div>
          )}

          {rateLimitWarning && (
            <div role="alert" style={styles.warningBanner}>
              Too many attempts. Please wait before trying again.
            </div>
          )}

          <div style={styles.formGroup}>
            <label htmlFor="register-full-name" style={styles.label}>
              Full name
            </label>
            <input
              id="register-full-name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                ...styles.input,
                ...(errors.full_name ? styles.inputError : {}),
              }}
              placeholder="Jane Doe"
              maxLength={255}
            />
            {errors.full_name && (
              <p role="alert" style={styles.fieldError}>
                {errors.full_name}
              </p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="register-email" style={styles.label}>
              Email address
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {}),
              }}
              placeholder="you@example.com"
              required
              maxLength={320}
            />
            {errors.email && (
              <p role="alert" style={styles.fieldError}>
                {errors.email}
              </p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="register-phone" style={styles.label}>
              Phone number <span style={{ color: '#868e96', fontWeight: '400' }}>(optional)</span>
            </label>
            <input
              id="register-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                ...styles.input,
                ...(errors.phone ? styles.inputError : {}),
              }}
              placeholder="+91 99999 99999"
              maxLength={30}
            />
            {errors.phone && (
              <p role="alert" style={styles.fieldError}>
                {errors.phone}
              </p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="register-password" style={styles.label}>
              Password
            </label>
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {}),
              }}
              placeholder="Min. 8 characters"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                background: 'none',
                border: 'none',
                color: '#4c6ef5',
                fontSize: '12px',
                cursor: 'pointer',
                padding: '4px 0',
                marginTop: '4px',
              }}
            >
              {showPassword ? 'Hide' : 'Show'} password
            </button>
            {errors.password && (
              <p role="alert" style={styles.fieldError}>
                {errors.password}
              </p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="register-confirm" style={styles.label}>
              Confirm password
            </label>
            <input
              id="register-confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={{
                ...styles.input,
                ...(errors.confirm ? styles.inputError : {}),
              }}
              placeholder="Re-enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              style={{
                background: 'none',
                border: 'none',
                color: '#4c6ef5',
                fontSize: '12px',
                cursor: 'pointer',
                padding: '4px 0',
                marginTop: '4px',
              }}
            >
              {showConfirm ? 'Hide' : 'Show'} password
            </button>
            {errors.confirm && (
              <p role="alert" style={styles.fieldError}>
                {errors.confirm}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnDisabled : {}),
            }}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div style={styles.loginRow}>
          Already have an account?
          <Link to="/login" style={styles.loginLink}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
