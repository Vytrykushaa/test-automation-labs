// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');
const config = require('./core/config');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 90000,
  expect: { timeout: config.TIMEOUTS.expect },
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [['html', { open: 'never', outputFolder: 'playwright-report' }], ['list']],

  use: {
    baseURL: config.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: false,
    viewport: config.VIEWPORT,
    actionTimeout: config.TIMEOUTS.action,
    navigationTimeout: config.TIMEOUTS.navigation,
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'unit',
      testMatch: '**/unit/*.spec.js',
      use: { browserName: 'chromium' },
    },
    {
      name: 'api',
      testMatch: '**/api/*.spec.js',
      use: { browserName: 'chromium' },
    },
    {
      name: 'ui',
      testMatch: '**/ui/*.spec.js',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'component',
      testMatch: '**/component/*.spec.js',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'e2e',
      testMatch: '**/e2e/*.spec.js',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});