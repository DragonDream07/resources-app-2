import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

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
    maxWidth: '440px',
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
    color: '#495057',
    textAlign: 'center',
    lineHeight: '20px',
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
  successPanel: {
    textAlign: 'center',
    padding: '24px 0',
  },
  successIcon: {
    width: '56px',
    height: '56px',
    backgroundColor: '#d3f9d8',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    fontSize: '28px',
  },
  successHeading: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '8px',
  },
  successBody: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    marginBottom: '24px',
  },
  invalidPanel: {
    textAlign: 'center',
    padding: '24px 0',
  },
  signInLink: {
    color: '#4c6ef5',
    marginLeft: '4px',
    textDecoration: 'none',
  },
};

function validatePassword(value) {
  if (!value || value.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

function validateConfirm(value, password) {
  if (value !== password) return 'Passwords do not match.';
  return null;
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [bannerError, setBannerError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const validate = () => {
    const errs = {};
    const passwordErr = validatePassword(password);
    if (passwordErr) errs.password = passwordErr;
    const confirmErr = validateConfirm(confirm, password);
    if (confirmErr) errs.confirm = confirmErr;
    return errs;
  };

  if (!token) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.invalidPanel}>
            <h1 style={{ ...styles.heading, marginBottom: '16px' }}>Invalid or expired link</h1>
            <p style={styles.subtext}>
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              to="/forgot-password"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                backgroundColor: '#4c6ef5',
                color: '#ffffff',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '16px',
                textDecoration: 'none',
                minHeight: '44px',
                lineHeight: '24px',
                marginBottom: '16px',
              }}
            >
              Request new link
            </Link>
            <p style={{ fontSize: '14px', color: '#495057', marginTop: '16px' }}>
              Remembered it?
              <Link to="/login" style={styles.signInLink}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBannerError(null);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (res.status === 400 || res.status === 422) {
        setBannerError('This reset link is invalid or has expired. Please request a new one.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        showToast('Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess(true);
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
        {success ? (
          <div style={styles.successPanel}>
            <div style={styles.successIcon} aria-hidden="true">✓</div>
            <h2 style={styles.successHeading}>Password reset successfully</h2>
            <p style={styles.successBody}>
              Your password has been updated. Please sign in manually with your new password.
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                backgroundColor: '#4c6ef5',
                color: '#ffffff',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '16px',
                textDecoration: 'none',
                minHeight: '44px',
                lineHeight: '24px',
              }}
            >
              Go to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 style={styles.heading}>Reset password</h1>
            <p style={styles.subtext}>Enter your new password below.</p>

            <form onSubmit={handleSubmit} noValidate>
              {bannerError && (
                <div role="alert" style={styles.errorBanner}>
                  {bannerError}
                </div>
              )}

              <div style={styles.formGroup}>
                <label htmlFor="reset-password" style={styles.label}>
                  New password
                </label>
                <input
                  id="reset-password"
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
                <label htmlFor="reset-confirm" style={styles.label}>
                  Confirm new password
                </label>
                <input
                  id="reset-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  style={{
                    ...styles.input,
                    ...(errors.confirm ? styles.inputError : {}),
                  }}
                  placeholder="Re-enter your new password"
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
                {loading ? 'Resetting…' : 'Reset password'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#495057' }}>
              Remembered it?
              <Link to="/login" style={styles.signInLink}>
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
