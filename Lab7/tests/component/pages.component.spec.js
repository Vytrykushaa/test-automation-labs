// tests/component/pages.component.spec.js
// Компонентні тести: перевіряють Page Objects та helper-функції в ізоляції

const { test, expect } = require('@playwright/test');
const ProductsPage = require('../../business/pages/ProductsPage');
const BasePage = require('../../business/pages/BasePage');
const { registerUser, deleteAccount } = require('../helpers/registration');

test.describe('Component: BasePage', () => {

  test('COMP-01: navigate() відкриває сторінку за відносним шляхом', async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.navigate('/');
    await basePage.expectTitle(/Automation Exercise/);
  });

  test('COMP-02: expectURL() правильно перевіряє URL за регулярним виразом', async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.navigate('/products');
    await basePage.expectURL(/products/);
  });

  test('COMP-03: getURL() повертає поточний URL як рядок', async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.navigate('/products');
    const url = basePage.getURL();
    expect(typeof url).toBe('string');
    expect(url).toContain('automationexercise.com');
  });
});

test.describe('Component: ProductsPage', () => {

  test('COMP-04: open() відкриває сторінку /products та чекає товари', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await productsPage.expectURL(/products/);
    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('COMP-05: search() заповнює поле та виконує пошук', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await productsPage.search('top');
    await productsPage.expectHeading('Searched Products');
  });

  test('COMP-06: getProductCount() повертає число більше 0 на сторінці Products', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    const count = await productsPage.getProductCount();
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThan(0);
  });

  test('COMP-07: openFirstProduct() переходить на сторінку деталей', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.open();
    await productsPage.openFirstProduct();
    await productsPage.expectURL(/product_details/);
  });
});

test.describe('Component: helpers/registration', () => {

  test('COMP-08: registerUser() + deleteAccount() — повний цикл без помилок', async ({ page }) => {
    const email = `comp_${Date.now()}@mailtest.com`;
    await registerUser(page, email, 'Comp User');
    await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();
    await deleteAccount(page);
    await expect(page.locator('b:has-text("Account Deleted!")')).toBeVisible();
  });
});
