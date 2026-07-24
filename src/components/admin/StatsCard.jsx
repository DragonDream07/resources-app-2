import React from 'react';
import PropTypes from 'prop-types';

const TrendIndicator = ({ trend, value }) => {
  if (trend === undefined || trend === null) return null;

  const isPositive = trend >= 0;
  const color = isPositive ? 'text-green-600' : 'text-red-600';
  const arrow = isPositive ? '▲' : '▼';

  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${color}`}>
      <span>{arrow}</span>
      <span>{Math.abs(value ?? trend)}%</span>
    </span>
  );
};

const StatsCard = ({ label, value, trend, trendValue, icon: Icon, prefix, suffix, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        {Icon && (
          <span className="text-gray-400">
            <Icon size={20} />
          </span>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-gray-900">
          {prefix && <span className="text-xl text-gray-600 mr-0.5">{prefix}</span>}
          {value !== undefined && value !== null ? value.toLocaleString() : '—'}
          {suffix && <span className="text-xl text-gray-600 ml-0.5">{suffix}</span>}
        </span>
      </div>

      {(trend !== undefined && trend !== null) && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <TrendIndicator trend={trend} value={trendValue} />
          <span>vs last period</span>
        </div>
      )}
    </div>
  );
};

StatsCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  trend: PropTypes.number,
  trendValue: PropTypes.number,
  icon: PropTypes.elementType,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  loading: PropTypes.bool,
};

StatsCard.defaultProps = {
  loading: false,
};

export default StatsCard;
