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
  passwordRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  forgotLink: {
    fontSize: '14px',
    color: '#4c6ef5',
    textDecoration: 'none',
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
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
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
  registerRow: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#495057',
  },
  registerLink: {
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

function validatePassword(value) {
  if (!value || value.length < 1) return 'Password is required.';
  return null;
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorBanner(null);

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    if (emailErr || passwordErr) {
      setErrorBanner(emailErr || passwordErr);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 429) {
        setErrorBanner('Too many login attempts. Please try again later.');
        setLoading(false);
        return;
      }

      if (res.status === 401 || res.status === 400) {
        setErrorBanner('Incorrect email or password.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        showToast('Something went wrong. Try again.');
        setLoading(false);
        return;
      }

      navigate('/');
    } catch {
      showToast('Something went wrong. Try again.');
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
        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.subtext}>Sign in to your account</p>

        <form onSubmit={handleSubmit} noValidate>
          {errorBanner && (
            <div role="alert" style={styles.errorBanner}>
              <span aria-hidden="true">&#9888;</span>
              <span>{errorBanner}</span>
            </div>
          )}

          <div style={styles.formGroup}>
            <label htmlFor="login-email" style={styles.label}>
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="you@example.com"
              required
              maxLength={320}
            />
          </div>

          <div style={styles.formGroup}>
            <div style={styles.passwordRow}>
              <label htmlFor="login-password" style={styles.label}>
                Password
              </label>
              <Link to="/forgot-password" style={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnDisabled : {}),
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={styles.registerRow}>
          Don&apos;t have an account?
          <Link to="/register" style={styles.registerLink}>
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
