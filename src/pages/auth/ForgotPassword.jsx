import { useState } from 'react';
import { Link } from 'react-router-dom';

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
    marginTop: '40px',
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
  links: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '24px',
    fontSize: '14px',
  },
};

function validateEmail(value) {
  if (!value) return 'Enter a valid email address.';
  if (value.length > 320) return 'Enter a valid email address.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) return 'Enter a valid email address.';
  return null;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(null);
    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok && res.status !== 404) {
        showToast('Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      // Always show success to prevent email enumeration
      showToast('If that address is registered, a reset link is on its way.');
      setSubmitted(true);
    } catch {
      showToast('Something went wrong. Please try again.');
    } finally {
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
        {submitted ? (
          <div style={styles.successPanel}>
            <div style={styles.successIcon} aria-hidden="true">✓</div>
            <h2 style={styles.successHeading}>Check your inbox</h2>
            <p style={styles.successBody}>
              If that address is registered, a reset link is on its way. Check your email and follow
              the instructions to reset your password.
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
            <h1 style={styles.heading}>Forgot password</h1>
            <p style={styles.subtext}>
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div style={styles.formGroup}>
                <label htmlFor="forgot-email" style={styles.label}>
                  Email address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    ...styles.input,
                    ...(emailError ? styles.inputError : {}),
                  }}
                  placeholder="you@example.com"
                  required
                  maxLength={320}
                />
                {emailError && (
                  <p role="alert" style={styles.fieldError}>
                    {emailError}
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
                {loading ? 'Sending…' : 'Reset password'}
              </button>
            </form>

            <div style={styles.links}>
              <Link to="/login" style={{ color: '#4c6ef5', marginLeft: '4px', textDecoration: 'none' }}>
                Sign in
              </Link>
              <Link to="/register" style={{ color: '#4c6ef5', textDecoration: 'none' }}>
                Create account
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
