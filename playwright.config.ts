import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true, // Run all tests in files in parallel.
  forbidOnly: !!process.env.CI, // Fail if test.only is left in the source code when running in CI.
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 30_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    // headless: false,
  },

  projects: [
    {
      name: 'api',
      testMatch: '**/tests/api/**/*.spec.ts',
    },
    {
      name: 'ui',
      testMatch: '**/tests/ui/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.SAUCEDEMO_BASE_URL,
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  outputDir: 'test-results',
});
