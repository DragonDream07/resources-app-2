/**
 * Environment configuration
 * Reads import.meta.env vars and exports typed constants.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

export const IS_PRODUCTION = APP_ENV === 'production';

export const IS_DEVELOPMENT = APP_ENV === 'development';

export const ELASTICSEARCH_URL = import.meta.env.VITE_ELASTICSEARCH_URL || 'http://localhost:9200';

export const JWT_STORAGE_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || 'auth_token';

export const CART_STORAGE_KEY = import.meta.env.VITE_CART_STORAGE_KEY || 'cart_id';

export const GUEST_TOKEN_STORAGE_KEY = import.meta.env.VITE_GUEST_TOKEN_STORAGE_KEY || 'guest_token';

export const PAYMENT_GATEWAY_URL = import.meta.env.VITE_PAYMENT_GATEWAY_URL || '';

export const STATIC_ASSETS_BASE_URL = import.meta.env.VITE_STATIC_ASSETS_BASE_URL || '';

export const SEARCH_DEBOUNCE_MS = Number(import.meta.env.VITE_SEARCH_DEBOUNCE_MS) || 300;

export const PAGINATION_DEFAULT_LIMIT = Number(import.meta.env.VITE_PAGINATION_DEFAULT_LIMIT) || 20;
