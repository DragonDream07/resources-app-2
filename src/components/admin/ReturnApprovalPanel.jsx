import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ReturnApprovalPanel = ({ returnRequestId, currentStatus, onReview, loading: externalLoading }) => {
  const [refundNote, setRefundNote] = useState('');
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const isResolved = ['approved', 'rejected'].includes(currentStatus);

  const handleSubmit = async (action) => {
    setDecision(action);
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await onReview(returnRequestId, { status: action, refund_note: refundNote });
      setSuccess(`Return request has been ${action} successfully.`);
    } catch (err) {
      setError(err?.message ?? `Failed to ${action} the return request.`);
    } finally {
      setLoading(false);
      setDecision(null);
    }
  };

  if (isResolved) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
        <p className="text-sm text-gray-600">
          This return request has already been{' '}
          <span className={`font-semibold capitalize ${currentStatus === 'approved' ? 'text-green-700' : 'text-red-700'}`}>
            {currentStatus}
          </span>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
      <h3 className="text-base font-semibold text-gray-800">Review Return Request</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Refund Note</label>
        <textarea
          value={refundNote}
          onChange={(e) => setRefundNote(e.target.value)}
          rows={3}
          placeholder="Optional note for the customer or internal reference…"
          disabled={loading || externalLoading}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {success && (
        <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{success}</p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleSubmit('approved')}
          disabled={loading || externalLoading}
          className="flex-1 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading && decision === 'approved' ? 'Approving…' : 'Approve'}
        </button>

        <button
          type="button"
          onClick={() => handleSubmit('rejected')}
          disabled={loading || externalLoading}
          className="flex-1 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading && decision === 'rejected' ? 'Rejecting…' : 'Reject'}
        </button>
      </div>
    </div>
  );
};

ReturnApprovalPanel.propTypes = {
  returnRequestId: PropTypes.string.isRequired,
  currentStatus: PropTypes.string.isRequired,
  onReview: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

ReturnApprovalPanel.defaultProps = {
  loading: false,
};

export default ReturnApprovalPanel;
