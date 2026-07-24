import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DEFAULT_COLORS = [
  '#6366f1',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
];

const ReportChart = ({
  type,
  data,
  lines,
  bars,
  slices,
  xKey,
  title,
  subtitle,
  height,
  colors,
  loading,
  emptyMessage,
}) => {
  const palette = colors?.length ? colors : DEFAULT_COLORS;

  const isEmpty = !data || data.length === 0;

  const containerClass = `w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-5`;

  const renderChart = useMemo(() => {
    if (loading || isEmpty) return null;

    if (type === 'line') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {lines.map((line, i) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.label ?? line.key}
                stroke={line.color ?? palette[i % palette.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {bars.map((bar, i) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                name={bar.label ?? bar.key}
                fill={bar.color ?? palette[i % palette.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (type === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              dataKey={slices?.valueKey ?? 'value'}
              nameKey={slices?.nameKey ?? 'name'}
              cx="50%"
              cy="50%"
              outerRadius={Math.floor(height / 2.8)}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={palette[index % palette.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return <p className="text-sm text-red-500">Unsupported chart type: {type}</p>;
  }, [type, data, lines, bars, slices, xKey, height, palette, loading, isEmpty]);

  return (
    <div className={containerClass}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-base font-semibold text-gray-800">{title}</h3>}
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      )}

      {loading && (
        <div
          className="flex items-center justify-center bg-gray-50 rounded-xl animate-pulse"
          style={{ height }}
        >
          <span className="text-sm text-gray-400">Loading chart…</span>
        </div>
      )}

      {!loading && isEmpty && (
        <div
          className="flex items-center justify-center bg-gray-50 rounded-xl"
          style={{ height }}
        >
          <span className="text-sm text-gray-400">{emptyMessage ?? 'No data available.'}</span>
        </div>
      )}

      {!loading && !isEmpty && renderChart}
    </div>
  );
};

ReportChart.propTypes = {
  type: PropTypes.oneOf(['line', 'bar', 'pie']).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  lines: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string,
      color: PropTypes.string,
    })
  ),
  bars: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string,
      color: PropTypes.string,
    })
  ),
  slices: PropTypes.shape({
    valueKey: PropTypes.string,
    nameKey: PropTypes.string,
  }),
  xKey: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  height: PropTypes.number,
  colors: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
};

ReportChart.defaultProps = {
  data: [],
  lines: [],
  bars: [],
  height: 300,
  loading: false,
};

export default ReportChart;
