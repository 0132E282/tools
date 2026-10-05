import { defineConfig } from 'vitest/config';

export default defineConfig({
  cacheDir: './node_modules/.vite/client-tests',
  test: { include: ['Client/src/**/*.spec.ts'], environment: 'node' },
});
