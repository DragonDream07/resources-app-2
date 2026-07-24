import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const UserRoleEditor = ({ userId, currentRoles, availableRoles, onSave, loading: externalLoading }) => {
  const [selectedRoles, setSelectedRoles] = useState(currentRoles ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setSelectedRoles(currentRoles ?? []);
  }, [currentRoles]);

  const toggleRole = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId]
    );
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await onSave(userId, selectedRoles);
      setSuccess('Roles updated successfully.');
    } catch (err) {
      setError(err?.message ?? 'Failed to update roles.');
    } finally {
      setLoading(false);
    }
  };

  const isBusy = loading || externalLoading;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Assign Roles</h3>

      <div className="space-y-2">
        {availableRoles.map((role) => (
          <label key={role.id} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedRoles.includes(role.id)}
              onChange={() => toggleRole(role.id)}
              disabled={isBusy}
              className="w-4 h-4 text-indigo-600 rounded border-gray-300 disabled:opacity-60"
            />
            <span className="text-sm text-gray-800 group-hover:text-indigo-700 transition-colors">
              {role.name}
            </span>
            {role.description && (
              <span className="text-xs text-gray-400">— {role.description}</span>
            )}
          </label>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      {success && <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{success}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={isBusy}
        className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Saving…' : 'Save Roles'}
      </button>
    </div>
  );
};

UserRoleEditor.propTypes = {
  userId: PropTypes.string.isRequired,
  currentRoles: PropTypes.arrayOf(PropTypes.string),
  availableRoles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ),
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

UserRoleEditor.defaultProps = {
  currentRoles: [],
  availableRoles: [],
  loading: false,
};

export default UserRoleEditor;
