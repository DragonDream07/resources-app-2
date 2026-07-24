/**
 * @fileoverview JSDoc type definitions for admin domain.
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} total_orders - Total number of orders placed
 * @property {number} total_revenue - Cumulative revenue in minor currency units
 * @property {number} total_users - Total registered user accounts
 * @property {number} total_products - Total active products in catalogue
 * @property {number} pending_returns - Number of return requests awaiting review
 * @property {number} orders_today - Orders placed in the current calendar day
 * @property {number} revenue_today - Revenue generated today in minor currency units
 */

/**
 * @typedef {Object} ReportDataPoint
 * @property {string} date - ISO date string (YYYY-MM-DD) for the data point
 * @property {number} orders - Number of orders on this date
 * @property {number} revenue - Revenue on this date in minor currency units
 */

/**
 * @typedef {Object} ReportData
 * @property {ReportDataPoint[]} data_points - Ordered array of daily report data
 * @property {string} from - Start date of the report range (ISO date string)
 * @property {string} to - End date of the report range (ISO date string)
 * @property {number} total_orders - Aggregate order count over the range
 * @property {number} total_revenue - Aggregate revenue over the range (minor units)
 */

/**
 * @typedef {Object} AdminUser
 * @property {string} id - UUID of the admin user
 * @property {string} email - Email address
 * @property {string} first_name - First name
 * @property {string} last_name - Last name
 * @property {string|null} phone - Phone number
 * @property {boolean} is_active - Whether the account is active
 * @property {string[]} roles - Array of role names (should include 'admin')
 * @property {string} created_at - ISO timestamp of account creation
 * @property {string} updated_at - ISO timestamp of last update
 */

export {};
