import { useState } from 'react';
import { Link } from 'react-router-dom';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const initialErrors = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const PASSWORD_MIN_LENGTH = 8;

function validate(fields) {
  const errors = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  if (!fields.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!fields.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }

  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.';
  }

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

const ALL_TOUCHED = {
  firstName: true,
  lastName: true,
  email: true,
  password: true,
  confirmPassword: true,
};

export default function RegisterForm({ onSubmit, loading = false, serverError = '' }) {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    const updated = { ...fields, [name]: value };
    setFields(updated);
    if (touched[name]) {
      const validated = validate(updated);
      setErrors((prev) => ({ ...prev, [name]: validated[name] }));
    }
    // Re-validate confirmPassword when password changes
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
    setTouched(ALL_TOUCHED);
    const validated = validate(fields);
    setErrors(validated);
    if (hasErrors(validated)) return;
    if (onSubmit) {
      onSubmit({
        firstName: fields.firstName.trim(),
        lastName: fields.lastName.trim(),
        email: fields.email.trim(),
        password: fields.password,
      });
    }
  }

  function fieldProps(name, id, type = 'text', autoComplete = '') {
    return {
      id,
      type,
      name,
      autoComplete: autoComplete || undefined,
      value: fields[name],
      onChange: handleChange,
      onBlur: handleBlur,
      'aria-describedby': errors[name] ? `${id}-error` : undefined,
      'aria-invalid': !!errors[name],
      className: `form-input${errors[name] ? ' form-input--error' : ''}`,
      disabled: loading,
    };
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Registration form">
      {serverError && (
        <div role="alert" className="form-server-error">
          {serverError}
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="register-firstName" className="form-label">
            First name
          </label>
          <input {...fieldProps('firstName', 'register-firstName', 'text', 'given-name')} />
          {errors.firstName && (
            <span id="register-firstName-error" role="alert" className="form-error-message">
              {errors.firstName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="register-lastName" className="form-label">
            Last name
          </label>
          <input {...fieldProps('lastName', 'register-lastName', 'text', 'family-name')} />
          {errors.lastName && (
            <span id="register-lastName-error" role="alert" className="form-error-message">
              {errors.lastName}
            </span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="register-email" className="form-label">
          Email address
        </label>
        <input {...fieldProps('email', 'register-email', 'email', 'email')} />
        {errors.email && (
          <span id="register-email-error" role="alert" className="form-error-message">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="register-password" className="form-label">
          Password
        </label>
        <input {...fieldProps('password', 'register-password', 'password', 'new-password')} />
        {errors.password && (
          <span id="register-password-error" role="alert" className="form-error-message">
            {errors.password}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="register-confirmPassword" className="form-label">
          Confirm password
        </label>
        <input
          {...fieldProps('confirmPassword', 'register-confirmPassword', 'password', 'new-password')}
        />
        {errors.confirmPassword && (
          <span id="register-confirmPassword-error" role="alert" className="form-error-message">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn--primary btn--full-width"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      <p className="form-footer-text">
        Already have an account?{' '}
        <Link to="/login" className="form-link">
          Sign in
        </Link>
      </p>
    </form>
  );
}
