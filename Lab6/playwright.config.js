// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Директорія з тестами
  testDir: './tests',

  // Максимальний час виконання одного тесту (90 секунд)
  timeout: 90000,

  // Максимальний час для перевірки expect()
  expect: { timeout: 15000 },

  // Вимкнути паралельне виконання (E2E тести мають бути послідовними)
  fullyParallel: false,

  // Заборона test.only у CI середовищі
  forbidOnly: !!process.env.CI,

  // Кількість повторних запусків при невдачі
  retries: 1,

  // Один воркер — один браузер одночасно
  workers: 1,

  // Формати звітності
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
  ],

  use: {
    // Базова URL сайту для тестування
    baseURL: 'https://automationexercise.com',

    // Зберігати trace при повторному запуску після невдачі
    trace: 'on-first-retry',

    // Скріншоти лише при невдачі
    screenshot: 'only-on-failure',

    // Режим відображення браузера (false = показувати вікно)
    headless: false,

    // Розмір вікна браузера
    viewport: { width: 1366, height: 768 },

    // Таймаут на дії (клік, заповнення поля тощо)
    actionTimeout: 20000,

    // Таймаут на навігацію
    navigationTimeout: 45000,

    // Ігнорувати помилки HTTPS
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
