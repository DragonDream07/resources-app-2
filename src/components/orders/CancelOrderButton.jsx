import React, { useState } from 'react';

function CancelOrderButton({ orderId, onCancel, isLoading = false, disabled = false }) {
  const [showDialog, setShowDialog] = useState(false);
  const [reason, setReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const CANCEL_REASONS = [
    'Changed my mind',
    'Found a better price elsewhere',
    'Ordered by mistake',
    'Delivery time is too long',
    'Other',
  ];

  const handleOpenDialog = () => {
    setShowDialog(true);
    setReason('');
  };

  const handleClose = () => {
    if (cancelling) return;
    setShowDialog(false);
    setReason('');
  };

  const handleConfirm = async () => {
    if (!reason) return;
    setCancelling(true);
    try {
      await onCancel({ orderId, reason });
      setShowDialog(false);
      setReason('');
    } catch {
      // error handled by parent
    } finally {
      setCancelling(false);
    }
  };

  const isBusy = isLoading || cancelling;

  return (
    <>
      <button
        type="button"
        onClick={handleOpenDialog}
        disabled={disabled || isBusy}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-red-300 text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Cancel Order
      </button>

      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-dialog-title"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={handleClose}
            aria-hidden="true"
          />

          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2
                  id="cancel-dialog-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  Cancel Order
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={cancelling}
                className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Close dialog"
              >
                <img src="/src/assets/icons/close.svg" alt="Close" className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-5">
              <label
                htmlFor="cancel-reason"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Reason for cancellation <span className="text-red-500">*</span>
              </label>
              <select
                id="cancel-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={cancelling}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="">Select a reason</option>
                {CANCEL_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={cancelling}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!reason || cancelling}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CancelOrderButton;
