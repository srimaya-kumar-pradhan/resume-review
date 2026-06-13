/**
 * Babel configuration for Jest.
 * Transforms JSX and modern JS syntax for the Node.js test environment.
 * This config is NOT used by Vite (which has its own transform pipeline).
 */
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
