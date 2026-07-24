import React from 'react';

const STATUS_BADGE_STYLES = {
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PACKED: 'bg-yellow-100 text-yellow-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  RETURN_REQUESTED: 'bg-orange-100 text-orange-800',
  RETURNED: 'bg-gray-100 text-gray-800',
};

const STATUS_LABELS = {
  CONFIRMED: 'Confirmed',
  PACKED: 'Packed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURN_REQUESTED: 'Return Requested',
  RETURNED: 'Returned',
};

function StatusBadge({ status }) {
  const style = STATUS_BADGE_STYLES[status] || 'bg-gray-100 text-gray-800';
  const label = STATUS_LABELS[status] || status;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}

function OrderCard({ order, onClick }) {
  const {
    orderId,
    id,
    createdAt,
    status,
    totalAmount,
    itemCount,
    currency = 'INR',
  } = order;

  const displayId = orderId || id;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  const formattedAmount =
    totalAmount !== undefined && totalAmount !== null
      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(totalAmount)
      : 'N/A';

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onClick && onClick(order)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick(order)}
      aria-label={`Order ${displayId}`}
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <img src="/src/assets/icons/package.svg" alt="" className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Order ID</p>
              <p className="text-sm font-semibold text-gray-900 font-mono">{displayId}</p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">{formattedDate}</p>
          </div>
          {itemCount !== undefined && (
            <div>
              <p className="text-xs text-gray-500">Items</p>
              <p className="text-sm font-medium text-gray-800 mt-0.5">{itemCount}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">{formattedAmount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
