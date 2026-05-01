// tests/e2e/scenario3_purchase.spec.js
// E2E Сценарій 3: Повний цикл покупки (перенесено з Lab6)

const { test, expect } = require('@playwright/test');
const { registerUser, deleteAccount } = require('../helpers/registration');
const { generateUniqueEmail } = require('../../core/helpers/utils');
const config = require('../../core/config');

test.describe('E2E Сценарій 3: Повний цикл покупки', () => {
  let testEmail;

  test.beforeEach(async ({ page }) => {
    testEmail = generateUniqueEmail('buyer');
    await registerUser(page, testEmail, 'Buyer User');
    await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await deleteAccount(page);
  });

  test('Додавання товару до кошика та оформлення покупки', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/products/);
    await page.waitForSelector('.product-image-wrapper');

    const firstProduct = page.locator('.product-image-wrapper').first();
    await firstProduct.hover();
    await firstProduct.locator('a.add-to-cart').first().click();

    await expect(page.locator('#cartModal .modal-title')).toContainText('Added!');
    await page.locator('#cartModal button:has-text("Continue Shopping")').click();

    await page.locator('a[href="/view_cart"]').first().click();
    await expect(page).toHaveURL(/view_cart/);
    await expect(page.locator('#cart_info_table')).toBeVisible();
    const cartItems = await page.locator('#cart_info_table tbody tr').count();
    expect(cartItems).toBeGreaterThan(0);

    await page.locator('a:has-text("Proceed To Checkout")').click();
    await expect(page).toHaveURL(/checkout/);
    await expect(page.locator('#address_delivery')).toBeVisible();
    await expect(page.locator('#address_delivery .address_firstname')).toContainText('Buyer');

    await page.locator('textarea.form-control').fill('Тестове замовлення для перевірки E2E.');
    await page.locator('a:has-text("Place Order")').click();

    await expect(page).toHaveURL(/payment/);
    await page.locator('[data-qa="name-on-card"]').fill(config.PAYMENT.nameOnCard);
    await page.locator('[data-qa="card-number"]').fill(config.PAYMENT.cardNumber);
    await page.locator('[data-qa="cvc"]').fill(config.PAYMENT.cvc);
    await page.locator('[data-qa="expiry-month"]').fill(config.PAYMENT.expiryMonth);
    await page.locator('[data-qa="expiry-year"]').fill(config.PAYMENT.expiryYear);
    await page.locator('[data-qa="pay-button"]').click();

    await expect(page.locator('b:has-text("Order Placed!")')).toBeVisible();
    await expect(page).toHaveURL(/payment_done/);
  });
});
