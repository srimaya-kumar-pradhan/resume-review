/**
 * Jest configuration for Smart Career Assistant.
 *
 * Uses jsdom for DOM simulation, babel-jest for JSX transform,
 * and identity-obj-proxy to mock CSS imports in tests.
 */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    /* Mock CSS imports so they don't break tests */
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    /* Mock static asset imports */
  },
  testPathIgnorePatterns: ['/node_modules/', '/functions/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/firebase.js',
  ],
};
