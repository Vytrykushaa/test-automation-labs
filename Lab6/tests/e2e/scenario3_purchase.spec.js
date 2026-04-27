// tests/e2e/scenario3_purchase.spec.js
// СЦЕНАРІЙ 3: Повний цикл покупки

const { test, expect } = require('@playwright/test');
const { registerUser, deleteAccount } = require('../helpers/registration');

test.describe('Сценарій 3: Повний цикл покупки', () => {

  let testEmail;

  test.beforeEach(async ({ page }) => {
    testEmail = `buyer${Date.now()}@mailtest.com`;
    await registerUser(page, testEmail, 'Buyer User');
    await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await deleteAccount(page);
  });

  test('Додавання товару до кошика та оформлення покупки', async ({ page }) => {

    // КРОК 1: Перехід до каталогу напряму (уникаємо Google vignette)
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/products/);
    await page.waitForSelector('.product-image-wrapper');

    // КРОК 2: Додавання першого товару до кошика
    const firstProduct = page.locator('.product-image-wrapper').first();
    await firstProduct.hover();
    await firstProduct.locator('a.add-to-cart').first().click();

    // КРОК 3: Обробка модального вікна
    await expect(
      page.locator('#cartModal .modal-title')
    ).toContainText('Added!');
    await page.locator('#cartModal button:has-text("Continue Shopping")').click();

    // КРОК 4: Перехід до кошика
    await page.locator('a[href="/view_cart"]').first().click();
    await expect(page).toHaveURL(/view_cart/);
    await expect(page.locator('#cart_info_table')).toBeVisible();

    // ВИПРАВЛЕННЯ: правильний селектор рядків таблиці кошика
    const cartItems = await page.locator('#cart_info_table tbody tr').count();
    expect(cartItems).toBeGreaterThan(0);

    await expect(page.locator('.cart_quantity').first()).toBeVisible();

    // КРОК 5: Оформлення замовлення
    await page.locator('a:has-text("Proceed To Checkout")').click();
    await expect(page).toHaveURL(/checkout/);
    await expect(page.locator('#address_delivery')).toBeVisible();
    await expect(
      page.locator('#address_delivery .address_firstname')
    ).toContainText('Buyer');
    await expect(page.locator('#cart_info table')).toBeVisible();

    // КРОК 6: Коментар та підтвердження
    await page.locator('textarea.form-control').fill(
      'Тестове замовлення для перевірки E2E сценарію.'
    );
    await page.locator('a:has-text("Place Order")').click();

    // КРОК 7: Платіжні дані
    await expect(page).toHaveURL(/payment/);
    await page.locator('[data-qa="name-on-card"]').fill('Buyer User');
    await page.locator('[data-qa="card-number"]').fill('4111111111111111');
    await page.locator('[data-qa="cvc"]').fill('123');
    await page.locator('[data-qa="expiry-month"]').fill('12');
    await page.locator('[data-qa="expiry-year"]').fill('2027');
    await page.locator('[data-qa="pay-button"]').click();

    // КРОК 8: Перевірка успіху
    await expect(
      page.locator('b:has-text("Order Placed!")')
    ).toBeVisible();
    await expect(page).toHaveURL(/payment_done/);
  });

});
