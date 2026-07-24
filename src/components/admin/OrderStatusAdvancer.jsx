import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ORDER_STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const OrderStatusAdvancer = ({ orderId, currentStatus, userRole, onAdvance }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const allowedRoles = ['admin', 'super_admin'];
  const canAdvance = allowedRoles.includes(userRole);

  if (!canAdvance) {
    return (
      <div className="text-sm text-gray-400 italic">You do not have permission to advance this order.</div>
    );
  }

  const nextStatuses = ORDER_STATUS_TRANSITIONS[currentStatus] ?? [];

  if (nextStatuses.length === 0) {
    return (
      <div className="text-sm text-gray-500">No further status transitions available.</div>
    );
  }

  const handleAdvance = async () => {
    if (!selectedStatus) return;
    setLoading(true);
    setError(null);
    try {
      await onAdvance(orderId, selectedStatus);
      setSelectedStatus('');
    } catch (err) {
      setError(err?.message ?? 'Failed to advance order status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          disabled={loading}
          aria-label="Select next order status"
        >
          <option value="">Select next status…</option>
          {nextStatuses.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status] ?? status}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleAdvance}
          disabled={!selectedStatus || loading}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Advancing…' : 'Advance Status'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <p className="text-xs text-gray-500">
        Current status: <span className="font-semibold capitalize">{STATUS_LABELS[currentStatus] ?? currentStatus}</span>
      </p>
    </div>
  );
};

OrderStatusAdvancer.propTypes = {
  orderId: PropTypes.string.isRequired,
  currentStatus: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  onAdvance: PropTypes.func.isRequired,
};

export default OrderStatusAdvancer;
