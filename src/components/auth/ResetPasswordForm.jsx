import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const PASSWORD_MIN_LENGTH = 8;

const initialState = {
  password: '',
  confirmPassword: '',
};

const initialErrors = {
  password: '',
  confirmPassword: '',
};

function validate(fields) {
  const errors = { password: '', confirmPassword: '' };

  if (!fields.password) {
    errors.password = 'Password is required.';
  } else if (fields.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (fields.confirmPassword !== fields.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

function hasErrors(errors) {
  return Object.values(errors).some((e) => e !== '');
}

export default function ResetPasswordForm({
  onSubmit,
  loading = false,
  serverError = '',
  successMessage = '',
}) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });

  const tokenMissing = !token;

  function handleChange(e) {
    const { name, value } = e.target;
    const updated = { ...fields, [name]: value };
    setFields(updated);
    if (touched[name]) {
      const validated = validate(updated);
      setErrors((prev) => ({ ...prev, [name]: validated[name] }));
    }
    if (name === 'password' && touched.confirmPassword) {
      const validated = validate(updated);
      setErrors((prev) => ({ ...prev, confirmPassword: validated.confirmPassword }));
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
    setTouched({ password: true, confirmPassword: true });
    const validated = validate(fields);
    setErrors(validated);
    if (hasErrors(validated)) return;
    if (onSubmit) {
      onSubmit({ token, password: fields.password });
    }
  }

  if (tokenMissing) {
    return (
      <div className="form-notice" role="alert">
        <p>This password reset link is invalid or has expired.</p>
        <Link to="/forgot-password" className="form-link">
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Reset password form">
      {serverError && (
        <div role="alert" className="form-server-error">
          {serverError}
        </div>
      )}

      {successMessage && (
        <div role="status" className="form-success-message">
          {successMessage}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="reset-password" className="form-label">
          New password
        </label>
        <input
          id="reset-password"
          type="password"
          name="password"
          autoComplete="new-password"
          value={fields.password}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-describedby={errors.password ? 'reset-password-error' : undefined}
          aria-invalid={!!errors.password}
          className={`form-input${errors.password ? ' form-input--error' : ''}`}
          disabled={loading || !!successMessage}
        />
        {errors.password && (
          <span id="reset-password-error" role="alert" className="form-error-message">
            {errors.password}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="reset-confirmPassword" className="form-label">
          Confirm new password
        </label>
        <input
          id="reset-confirmPassword"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          value={fields.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-describedby={errors.confirmPassword ? 'reset-confirmPassword-error' : undefined}
          aria-invalid={!!errors.confirmPassword}
          className={`form-input${errors.confirmPassword ? ' form-input--error' : ''}`}
          disabled={loading || !!successMessage}
        />
        {errors.confirmPassword && (
          <span id="reset-confirmPassword-error" role="alert" className="form-error-message">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn--primary btn--full-width"
        disabled={loading || !!successMessage}
        aria-busy={loading}
      >
        {loading ? 'Resetting…' : 'Reset password'}
      </button>

      {successMessage && (
        <p className="form-footer-text">
          <Link to="/login" className="form-link">
            Back to sign in
          </Link>
        </p>
      )}
    </form>
  );
}
