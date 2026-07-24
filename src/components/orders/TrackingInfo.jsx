import React from 'react';

const CARRIER_LABELS = {
  BLUEDART: 'Blue Dart',
  DELHIVERY: 'Delhivery',
  DTDC: 'DTDC',
  FEDEX: 'FedEx',
  ECOM_EXPRESS: 'Ecom Express',
  INDIA_POST: 'India Post',
};

function TrackingEvent({ event }) {
  const { location, description, timestamp, status } = event;
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center">
        <span className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
        <span className="flex-1 w-px bg-gray-200 mt-1" />
      </div>
      <div className="pb-5">
        <p className="text-sm font-medium text-gray-900">{description || status}</p>
        {location && <p className="text-xs text-gray-500 mt-0.5">{location}</p>}
        {formattedTime && <p className="text-xs text-gray-400 mt-0.5">{formattedTime}</p>}
      </div>
    </li>
  );
}

function TrackingInfo({ tracking }) {
  if (!tracking) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <img
          src="/src/assets/icons/package.svg"
          alt=""
          className="w-10 h-10 mx-auto mb-3 opacity-30"
        />
        <p className="text-sm text-gray-500">Tracking information is not yet available.</p>
        <p className="text-xs text-gray-400 mt-1">
          Please check back once your order has been shipped.
        </p>
      </div>
    );
  }

  const {
    carrier,
    trackingNumber,
    trackingUrl,
    estimatedDelivery,
    currentStatus,
    currentLocation,
    events = [],
  } = tracking;

  const carrierLabel = CARRIER_LABELS[carrier] || carrier;

  const formattedEDD = estimatedDelivery
    ? new Date(estimatedDelivery).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
      })
    : null;

  return (
    <div className="space-y-5">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            {carrierLabel && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Carrier</span>
                <span className="text-sm font-medium text-gray-900">{carrierLabel}</span>
              </div>
            )}
            {trackingNumber && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">AWB</span>
                <span className="text-sm font-mono font-medium text-gray-900">{trackingNumber}</span>
              </div>
            )}
            {currentStatus && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Status</span>
                <span className="text-sm font-medium text-gray-900">{currentStatus}</span>
              </div>
            )}
            {currentLocation && (
              <div className="flex items-center gap-2">
                <img src="/src/assets/icons/map-pin.svg" alt="" className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-sm text-gray-700">{currentLocation}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            {formattedEDD && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Estimated Delivery</p>
                <p className="text-sm font-semibold text-green-700">{formattedEDD}</p>
              </div>
            )}
            {trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Track on carrier website
                <img src="/src/assets/icons/external-link.svg" alt="" className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {events && events.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Shipment Events</h4>
          <ul className="">
            {[...events]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((event, index) => (
                <TrackingEvent key={index} event={event} />
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TrackingInfo;
