/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config/)
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    logHeapUsage: true,

    clearMocks: true,
    passWithNoTests: true,
    setupFiles: './src/setupTests.ts',
    coverage: {
      reporter: ['lcov', 'html-spa', 'text', 'text-summary', 'json-summary', 'cobertura'],
    },
  },
});
