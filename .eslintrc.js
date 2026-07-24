'use strict';

module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['import'],
  extends: ['eslint:recommended', 'plugin:import/recommended'],
  rules: {
    // Disallow circular imports across the entire codebase
    'import/no-cycle': ['error', { maxDepth: Infinity, ignoreExternal: true }],

    // Enforce module boundary direction:
    // routes -> controller -> service -> repository -> db/client
    // No layer may import from a layer above it.
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // repositories must not import from services or controllers
          {
            target: './src/db/repositories',
            from: './src/modules',
            message: 'Repositories must not import from module layer (services/controllers).',
          },
          // db client must not import from any module
          {
            target: './src/db/client.js',
            from: './src/modules',
            message: 'DB client must not import from module layer.',
          },
          // config must not import from modules
          {
            target: './src/config',
            from: './src/modules',
            message: 'Config must not import from module layer.',
          },
          // utils must not import from modules
          {
            target: './src/utils',
            from: './src/modules',
            message: 'Utils must not import from module layer.',
          },
          // middleware must not import from modules (except shared validators)
          {
            target: './src/middleware',
            from: './src/modules',
            message: 'Middleware must not import from module layer.',
          },
        ],
      },
    ],

    // General code quality rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/default': 'error',
    'import/export': 'error',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
      },
    },
  },
};
