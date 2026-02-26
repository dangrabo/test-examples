import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // Vitest automatically sets NODE_ENV=test, which our database.js
    // uses to switch to SQLite in-memory instead of MySQL
    coverage: { provider: 'v8' },
  },
});
