import React from 'react';

const STAGES = [
  { key: 'CONFIRMED', label: 'Confirmed', description: 'Your order has been confirmed' },
  { key: 'PACKED', label: 'Packed', description: 'Your order is being packed' },
  { key: 'SHIPPED', label: 'Shipped', description: 'Your order is on the way' },
  { key: 'DELIVERED', label: 'Delivered', description: 'Your order has been delivered' },
];

const STAGE_ORDER = ['CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'];

function getStageIndex(status) {
  const idx = STAGE_ORDER.indexOf(status);
  return idx;
}

function StageIcon({ completed, active }) {
  if (completed) {
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (active) {
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white ring-4 ring-blue-100">
        <span className="w-3 h-3 rounded-full bg-white" />
      </span>
    );
  }
  return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-400">
      <span className="w-3 h-3 rounded-full bg-gray-400" />
    </span>
  );
}

function StatusTimeline({ status, timeline = [] }) {
  const isCancelled = status === 'CANCELLED';
  const activeIndex = isCancelled ? -1 : getStageIndex(status);

  const getTimestampForStage = (stageKey) => {
    if (!timeline || timeline.length === 0) return null;
    const entry = timeline.find((t) => t.status === stageKey || t.stage === stageKey);
    return entry ? entry.createdAt || entry.timestamp || null : null;
  };

  const formatTimestamp = (ts) => {
    if (!ts) return null;
    return new Date(ts).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-red-800">Order Cancelled</p>
          <p className="text-xs text-red-600 mt-0.5">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ol className="flex items-start justify-between relative">
        {STAGES.map((stage, index) => {
          const completed = activeIndex > index;
          const active = activeIndex === index;
          const ts = getTimestampForStage(stage.key);

          return (
            <li key={stage.key} className="flex-1 flex flex-col items-center relative">
              {index < STAGES.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-0.5 ${
                    completed ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                  style={{ left: '50%' }}
                  aria-hidden="true"
                />
              )}
              <div className="relative z-10">
                <StageIcon completed={completed} active={active} />
              </div>
              <div className="mt-2 text-center px-1">
                <p
                  className={`text-xs font-semibold ${
                    completed || active ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {stage.label}
                </p>
                {ts && (
                  <p className="text-xs text-gray-500 mt-0.5">{formatTimestamp(ts)}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default StatusTimeline;
