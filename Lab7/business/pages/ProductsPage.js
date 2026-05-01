// business/pages/ProductsPage.js
// Бізнесовий рівень: Page Object для сторінки Products (POM)

const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    // Локатори — в одному місці (DRY)
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.productCards = page.locator('.product-image-wrapper');
    this.pageTitle = page.locator('.features_items h2.title');
  }

  /** Відкрити сторінку Products */
  async open() {
    await this.navigate('/products');
    await this.page.waitForSelector('.product-image-wrapper');
  }

  /**
   * Виконати пошук товару
   * @param {string} query
   */
  async search(query) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  /**
   * Отримати кількість карток товарів
   * @returns {number}
   */
  async getProductCount() {
    return await this.productCards.count();
  }

  /**
   * Перевірити заголовок сторінки
   * @param {string} text
   */
  async expectHeading(text) {
    await expect(this.pageTitle).toContainText(text);
  }

  /**
   * Клікнути "View Product" на першому знайденому товарі
   */
  async openFirstProduct() {
    await this.productCards
      .first()
      .locator('a[href*="product_details"]')
      .click();
  }

  /**
   * Додати перший товар до кошика через hover
   */
  async addFirstToCart() {
    const first = this.productCards.first();
    await first.hover();
    await first.locator('a.add-to-cart').first().click();
  }
}

module.exports = ProductsPage;
