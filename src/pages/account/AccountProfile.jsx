import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    marginBottom: '8px',
  },
  backLink: {
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    lineHeight: '28px',
    margin: '0 0 20px 0',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '6px',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  inputError: {
    borderColor: '#f03e3e',
  },
  fieldError: {
    color: '#f03e3e',
    fontSize: '12px',
    marginTop: '4px',
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  btnPrimary: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  btnGhost: {
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  successBanner: {
    backgroundColor: '#d3f9d8',
    color: '#212529',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  divider: {
    borderTop: '1px solid #e9ecef',
    margin: '24px 0',
  },
};

export default function AccountProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ first_name: '', last_name: '', email: '' });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileApiError, setProfileApiError] = useState('');
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  const [password, setPassword] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordApiError, setPasswordApiError] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  useEffect(() => {
    fetch('/users/me', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load profile');
        return res.json();
      })
      .then((data) => {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
        });
      })
      .catch(() => setProfileApiError('Failed to load profile.'))
      .finally(() => setProfileLoading(false));
  }, []);

  function validateProfile() {
    const errs = {};
    if (!profile.first_name.trim()) errs.first_name = 'First name is required.';
    if (!profile.last_name.trim()) errs.last_name = 'Last name is required.';
    if (!profile.email.trim()) errs.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) errs.email = 'Enter a valid email address.';
    return errs;
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileSuccess('');
    setProfileApiError('');
    const errs = validateProfile();
    if (Object.keys(errs).length > 0) { setProfileErrors(errs); return; }
    setProfileErrors({});
    setProfileSubmitting(true);
    try {
      const res = await fetch('/users/me', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to update profile.');
      }
      setProfileSuccess('Profile updated successfully.');
    } catch (err) {
      setProfileApiError(err.message || 'Failed to update profile.');
    } finally {
      setProfileSubmitting(false);
    }
  }

  function validatePassword() {
    const errs = {};
    if (!password.current_password) errs.current_password = 'Current password is required.';
    if (!password.new_password) errs.new_password = 'New password is required.';
    else if (password.new_password.length < 8) errs.new_password = 'Password must be at least 8 characters.';
    if (!password.confirm_password) errs.confirm_password = 'Please confirm your new password.';
    else if (password.new_password !== password.confirm_password) errs.confirm_password = 'Passwords do not match.';
    return errs;
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordApiError('');
    const errs = validatePassword();
    if (Object.keys(errs).length > 0) { setPasswordErrors(errs); return; }
    setPasswordErrors({});
    setPasswordSubmitting(true);
    try {
      const res = await fetch('/users/me/change-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: password.current_password,
          new_password: password.new_password,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to change password.');
      }
      setPasswordSuccess('Password changed successfully.');
      setPassword({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setPasswordApiError(err.message || 'Failed to change password.');
    } finally {
      setPasswordSubmitting(false);
    }
  }

  if (profileLoading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.card }}>
            <div style={{ height: '20px', backgroundColor: '#e9ecef', borderRadius: '6px', marginBottom: '12px', width: '50%' }} />
            <div style={{ height: '16px', backgroundColor: '#e9ecef', borderRadius: '6px', width: '70%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/account" style={styles.backLink}>← Back to account</Link>
        <h1 style={styles.pageTitle}>Account profile</h1>

        {/* Profile form */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Personal details</h2>
          {profileSuccess && <div style={styles.successBanner}>{profileSuccess}</div>}
          {profileApiError && <div style={styles.errorBanner}>{profileApiError}</div>}
          <form onSubmit={handleProfileSubmit} noValidate>
            <div style={styles.formGroup}>
              <label htmlFor="first_name" style={styles.label}>First name</label>
              <input
                id="first_name"
                type="text"
                style={{ ...styles.input, ...(profileErrors.first_name ? styles.inputError : {}) }}
                value={profile.first_name}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                autoComplete="given-name"
              />
              {profileErrors.first_name && <p style={styles.fieldError}>{profileErrors.first_name}</p>}
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="last_name" style={styles.label}>Last name</label>
              <input
                id="last_name"
                type="text"
                style={{ ...styles.input, ...(profileErrors.last_name ? styles.inputError : {}) }}
                value={profile.last_name}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                autoComplete="family-name"
              />
              {profileErrors.last_name && <p style={styles.fieldError}>{profileErrors.last_name}</p>}
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email address</label>
              <input
                id="email"
                type="email"
                style={{ ...styles.input, ...(profileErrors.email ? styles.inputError : {}) }}
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                autoComplete="email"
              />
              {profileErrors.email && <p style={styles.fieldError}>{profileErrors.email}</p>}
            </div>
            <div style={styles.btnRow}>
              <button type="submit" style={styles.btnPrimary} disabled={profileSubmitting}>
                {profileSubmitting ? 'Saving…' : 'Save changes'}
              </button>
              <button type="button" style={styles.btnGhost} onClick={() => navigate('/account')}>
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div style={styles.divider} />

        {/* Change password form */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Change password</h2>
          {passwordSuccess && <div style={styles.successBanner}>{passwordSuccess}</div>}
          {passwordApiError && <div style={styles.errorBanner}>{passwordApiError}</div>}
          <form onSubmit={handlePasswordSubmit} noValidate>
            <div style={styles.formGroup}>
              <label htmlFor="current_password" style={styles.label}>Current password</label>
              <input
                id="current_password"
                type="password"
                style={{ ...styles.input, ...(passwordErrors.current_password ? styles.inputError : {}) }}
                value={password.current_password}
                onChange={(e) => setPassword({ ...password, current_password: e.target.value })}
                autoComplete="current-password"
              />
              {passwordErrors.current_password && <p style={styles.fieldError}>{passwordErrors.current_password}</p>}
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="new_password" style={styles.label}>New password</label>
              <input
                id="new_password"
                type="password"
                style={{ ...styles.input, ...(passwordErrors.new_password ? styles.inputError : {}) }}
                value={password.new_password}
                onChange={(e) => setPassword({ ...password, new_password: e.target.value })}
                autoComplete="new-password"
              />
              {passwordErrors.new_password && <p style={styles.fieldError}>{passwordErrors.new_password}</p>}
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="confirm_password" style={styles.label}>Confirm new password</label>
              <input
                id="confirm_password"
                type="password"
                style={{ ...styles.input, ...(passwordErrors.confirm_password ? styles.inputError : {}) }}
                value={password.confirm_password}
                onChange={(e) => setPassword({ ...password, confirm_password: e.target.value })}
                autoComplete="new-password"
              />
              {passwordErrors.confirm_password && <p style={styles.fieldError}>{passwordErrors.confirm_password}</p>}
            </div>
            <div style={styles.btnRow}>
              <button type="submit" style={styles.btnPrimary} disabled={passwordSubmitting}>
                {passwordSubmitting ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
