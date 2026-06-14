import { defineConfig } from 'vitest/config';

/**
 * Vitest runs the pure-logic suites (providers, config) in Node — no React
 * Native runtime needed. Native tsconfig-paths resolution handles the `@/*`
 * alias from tsconfig.json.
 */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
