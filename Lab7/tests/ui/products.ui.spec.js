// tests/ui/products.ui.spec.js
// UI-тести: перевіряють елементи інтерфейсу сторінки Products

const { test, expect } = require('@playwright/test');
const ProductsPage = require('../../business/pages/ProductsPage');

test.describe('UI: Сторінка Products', () => {

  test('UI-01: Сторінка /products завантажується коректно', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await productsPage.expectURL(/products/);
  });

  test('UI-02: Відображається список товарів (кількість > 0)', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('UI-03: Поле пошуку та кнопка пошуку відображаються', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await expect(productsPage.searchInput).toBeVisible();
    await expect(productsPage.searchButton).toBeVisible();
  });

  test('UI-04: Пошук "dress" повертає результати з заголовком "Searched Products"', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await productsPage.search('dress');
    await productsPage.expectHeading('Searched Products');
    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('UI-05: Картка товару містить назву та ціну', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    const firstCard = productsPage.productCards.first();
    await expect(firstCard.locator('.productinfo p')).toBeVisible();
    await expect(firstCard.locator('.productinfo h2')).toBeVisible();
  });

  test('UI-06: Сторінка деталей товару відкривається коректно', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await productsPage.openFirstProduct();
    await productsPage.expectURL(/product_details/);
    await expect(page.locator('.product-information h2')).toBeVisible();
  });

  test('UI-07: Навігаційна панель містить посилання Home, Products, Cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await expect(page.locator('a[href="/"]').first()).toBeVisible();
    await expect(page.locator('a[href="/products"]')).toBeVisible();
    await expect(page.locator('a[href="/view_cart"]').first()).toBeVisible();
  });
});
