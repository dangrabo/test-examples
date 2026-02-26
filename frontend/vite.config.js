import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // jsdom simulates a browser DOM so React can render and query elements
    environment: 'jsdom',
    // Run setup file before each test file (imports jest-dom matchers)
    setupFiles: './src/test/setup.js',
    globals: true,
    coverage: { provider: 'v8' },
  },
});
