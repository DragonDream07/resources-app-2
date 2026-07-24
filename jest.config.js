'use strict';

module.exports = {
  // Use Node.js as the test environment
  testEnvironment: 'node',

  // Look for tests in __tests__ directories or files ending with .test.js / .spec.js
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js', '**/*.spec.js'],

  // Ignore node_modules and dist
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Collect coverage from source files only
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/db/migrations/**',
    '!src/db/seeds/**',
  ],

  // Coverage thresholds — CI will fail if these drop below the specified values
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'clover'],

  // Module name mapper for path aliases used across the project
  moduleNameMapper: {
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@db/(.*)$': '<rootDir>/src/db/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },

  // Run tests serially within each file to avoid port conflicts
  maxWorkers: 1,

  // Clear mock state between tests
  clearMocks: true,
  resetMocks: false,
  restoreMocks: true,

  // Verbose output
  verbose: true,
};
