import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  cacheDir: './node_modules/.vite/api-unit',
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './api',
    include: ['**/*.spec.ts'],
  },
});
