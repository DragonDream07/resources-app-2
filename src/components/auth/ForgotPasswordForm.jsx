import { useState } from 'react';
import { Link } from 'react-router-dom';

const initialState = { email: '' };
const initialErrors = { email: '' };

function validate(fields) {
  const errors = { email: '' };
  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  return errors;
}

function hasErrors(errors) {
  return Object.values(errors).some((e) => e !== '');
}

export default function ForgotPasswordForm({
  onSubmit,
  loading = false,
  serverError = '',
  successMessage = '',
}) {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({ email: false });

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
    setTouched({ email: true });
    const validated = validate(fields);
    setErrors(validated);
    if (hasErrors(validated)) return;
    if (onSubmit) onSubmit({ email: fields.email.trim() });
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Forgot password form">
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

      <p className="form-description">
        Enter the email address associated with your account and we&apos;ll send you a link to reset
        your password.
      </p>

      <div className="form-group">
        <label htmlFor="forgot-email" className="form-label">
          Email address
        </label>
        <input
          id="forgot-email"
          type="email"
          name="email"
          autoComplete="email"
          value={fields.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-describedby={errors.email ? 'forgot-email-error' : undefined}
          aria-invalid={!!errors.email}
          className={`form-input${errors.email ? ' form-input--error' : ''}`}
          disabled={loading || !!successMessage}
        />
        {errors.email && (
          <span id="forgot-email-error" role="alert" className="form-error-message">
            {errors.email}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn--primary btn--full-width"
        disabled={loading || !!successMessage}
        aria-busy={loading}
      >
        {loading ? 'Sending…' : 'Send reset link'}
      </button>

      <p className="form-footer-text">
        <Link to="/login" className="form-link">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
