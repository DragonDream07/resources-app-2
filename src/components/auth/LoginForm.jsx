import { useState } from 'react';
import { Link } from 'react-router-dom';

const initialState = {
  email: '',
  password: '',
};

const initialErrors = {
  email: '',
  password: '',
};

function validate(fields) {
  const errors = { email: '', password: '' };
  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!fields.password) {
    errors.password = 'Password is required.';
  }
  return errors;
}

function hasErrors(errors) {
  return Object.values(errors).some((e) => e !== '');
}

export default function LoginForm({ onSubmit, loading = false, serverError = '' }) {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({ email: false, password: false });

  function handleChange(e) {
    const { name, value } = e.target;
    const updated = { ...fields, [name]: value };
    setFields(updated);
    if (touched[name]) {
      const validated = validate(updated);
      setErrors((prev) => ({ ...prev, [name]: validated[name] }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validated = validate(fields);
    setErrors((prev) => ({ ...prev, [name]: validated[name] }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const allTouched = { email: true, password: true };
    setTouched(allTouched);
    const validated = validate(fields);
    setErrors(validated);
    if (hasErrors(validated)) return;
    if (onSubmit) onSubmit({ email: fields.email, password: fields.password });
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Login form">
      {serverError && (
        <div role="alert" className="form-server-error">
          {serverError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="login-email" className="form-label">
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          name="email"
          autoComplete="email"
          value={fields.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          aria-invalid={!!errors.email}
          className={`form-input${errors.email ? ' form-input--error' : ''}`}
          disabled={loading}
        />
        {errors.email && (
          <span id="login-email-error" role="alert" className="form-error-message">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <div className="form-label-row">
          <label htmlFor="login-password" className="form-label">
            Password
          </label>
          <Link to="/forgot-password" className="form-link form-link--small">
            Forgot password?
          </Link>
        </div>
        <input
          id="login-password"
          type="password"
          name="password"
          autoComplete="current-password"
          value={fields.password}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-describedby={errors.password ? 'login-password-error' : undefined}
          aria-invalid={!!errors.password}
          className={`form-input${errors.password ? ' form-input--error' : ''}`}
          disabled={loading}
        />
        {errors.password && (
          <span id="login-password-error" role="alert" className="form-error-message">
            {errors.password}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn--primary btn--full-width"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="form-footer-text">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="form-link">
          Create one
        </Link>
      </p>
    </form>
  );
}
