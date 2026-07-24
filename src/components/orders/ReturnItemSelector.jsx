import React, { useState } from 'react';

function ReturnItemSelector({ items = [], onSubmit, isLoading = false }) {
  const [selected, setSelected] = useState({});
  const [returnReason, setReturnReason] = useState('');
  const [itemReasons, setItemReasons] = useState({});

  const RETURN_REASONS = [
    'Damaged or defective item',
    'Wrong item received',
    'Item not as described',
    'Changed my mind',
    'Size or fit issue',
    'Quality not as expected',
    'Other',
  ];

  const eligibleItems = items.filter((item) => item.eligible !== false);

  const toggleItem = (itemId) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[itemId]) {
        delete next[itemId];
      } else {
        next[itemId] = { quantity: 1 };
      }
      return next;
    });
  };

  const setItemQuantity = (itemId, qty, maxQty) => {
    const clamped = Math.max(1, Math.min(Number(qty), maxQty));
    setSelected((prev) => ({
      ...prev,
      [itemId]: { ...(prev[itemId] || {}), quantity: clamped },
    }));
  };

  const setItemReason = (itemId, reason) => {
    setItemReasons((prev) => ({ ...prev, [itemId]: reason }));
  };

  const selectedIds = Object.keys(selected);
  const hasSelection = selectedIds.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasSelection || !returnReason) return;

    const returnItems = selectedIds.map((id) => ({
      orderItemId: id,
      quantity: selected[id].quantity,
      reason: itemReasons[id] || returnReason,
    }));

    onSubmit && onSubmit({ items: returnItems, reason: returnReason });
  };

  if (eligibleItems.length === 0) {
    return (
      <div className="text-center py-8">
        <img
          src="/src/assets/images/empty-state.svg"
          alt=""
          className="w-16 h-16 mx-auto mb-3 opacity-40"
        />
        <p className="text-sm text-gray-500">No items are eligible for return.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Select items to return
        </h3>
        <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
          {eligibleItems.map((item) => {
            const itemId = String(item.id || item.orderItemId);
            const isChecked = Boolean(selected[itemId]);
            const displayName = item.productName || item.name || 'Product';
            const displayVariant = item.skuName || item.variantLabel || null;
            const maxQty = item.quantity || 1;
            const currency = item.currency || 'INR';
            const unitPrice = item.unitPrice;

            return (
              <li
                key={itemId}
                className={`p-4 transition-colors ${
                  isChecked ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={`return-item-${itemId}`}
                    checked={isChecked}
                    onChange={() => toggleItem(itemId)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor={`return-item-${itemId}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={displayName}
                          className="w-12 h-12 object-cover rounded-md border border-gray-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center flex-shrink-0">
                          <img
                            src="/src/assets/images/placeholder-product.svg"
                            alt=""
                            className="w-6 h-6 opacity-30"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{displayName}</p>
                        {displayVariant && (
                          <p className="text-xs text-gray-500 mt-0.5">{displayVariant}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-0.5">Qty ordered: {maxQty}</p>
                        {unitPrice !== undefined && (
                          <p className="text-xs text-gray-500">
                            {new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency,
                            }).format(unitPrice)}
                            {' each'}
                          </p>
                        )}
                      </div>
                    </div>
                  </label>
                </div>

                {isChecked && (
                  <div className="mt-3 ml-7 space-y-3">
                    <div className="flex items-center gap-3">
                      <label
                        htmlFor={`return-qty-${itemId}`}
                        className="text-xs font-medium text-gray-600 w-28"
                      >
                        Return quantity
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setItemQuantity(
                              itemId,
                              (selected[itemId]?.quantity || 1) - 1,
                              maxQty
                            )
                          }
                          disabled={isLoading || (selected[itemId]?.quantity || 1) <= 1}
                          className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          <img src="/src/assets/icons/minus.svg" alt="-" className="w-3 h-3" />
                        </button>
                        <input
                          id={`return-qty-${itemId}`}
                          type="number"
                          min={1}
                          max={maxQty}
                          value={selected[itemId]?.quantity || 1}
                          onChange={(e) => setItemQuantity(itemId, e.target.value, maxQty)}
                          disabled={isLoading}
                          className="w-12 text-center text-sm border border-gray-300 rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setItemQuantity(
                              itemId,
                              (selected[itemId]?.quantity || 1) + 1,
                              maxQty
                            )
                          }
                          disabled={
                            isLoading || (selected[itemId]?.quantity || 1) >= maxQty
                          }
                          className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <img src="/src/assets/icons/plus.svg" alt="+" className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {maxQty > 1 && (
                      <p className="text-xs text-gray-400 ml-28">
                        Max returnable: {maxQty}
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <label
          htmlFor="return-reason"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Reason for return <span className="text-red-500">*</span>
        </label>
        <select
          id="return-reason"
          value={returnReason}
          onChange={(e) => setReturnReason(e.target.value)}
          disabled={isLoading}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
        >
          <option value="">Select a reason</option>
          {RETURN_REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-gray-500">
          {hasSelection
            ? `${selectedIds.length} item${selectedIds.length > 1 ? 's' : ''} selected`
            : 'No items selected'}
        </p>
        <button
          type="submit"
          disabled={!hasSelection || !returnReason || isLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Submitting...' : 'Submit Return Request'}
        </button>
      </div>
    </form>
  );
}

export default ReturnItemSelector;
