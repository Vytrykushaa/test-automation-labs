// business/pages/BasePage.js
// Бізнесовий рівень: базовий Page Object (принцип POM + KISS)

const { expect } = require('@playwright/test');
const config = require('../../core/config');

class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.baseURL = config.BASE_URL;
  }

  /**
   * Навігація на відносний або абсолютний URL
   * @param {string} path
   */
  async navigate(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Перевірка що поточний URL містить рядок
   * @param {string|RegExp} pattern
   */
  async expectURL(pattern) {
    await expect(this.page).toHaveURL(pattern);
  }

  /**
   * Перевірка заголовку сторінки
   * @param {string|RegExp} title
   */
  async expectTitle(title) {
    await expect(this.page).toHaveTitle(title);
  }

  /**
   * Отримати поточний URL
   * @returns {string}
   */
  getURL() {
    return this.page.url();
  }
}

module.exports = BasePage;
