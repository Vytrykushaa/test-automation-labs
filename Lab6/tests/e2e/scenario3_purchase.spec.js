// tests/e2e/scenario3_purchase.spec.js
// ============================================================
// СЦЕНАРІЙ 3: Повний цикл покупки (E2E)
// ============================================================
// Кроки сценарію:
//  1. Реєстрація та вхід нового користувача
//  2. Перехід на сторінку Products
//  3. Додавання першого товару до кошика
//  4. Перехід до кошика та перевірка вмісту
//  5. Оформлення замовлення (Proceed to Checkout)
//  6. Перевірка адреси доставки
//  7. Введення коментаря та натискання "Place Order"
//  8. Введення платіжних даних
//  9. Підтвердження оплати
// 10. Перевірка успішного розміщення замовлення
// ============================================================

const { test, expect } = require('@playwright/test');
const { registerUser, deleteAccount } = require('../helpers/registration');

test.describe('Сценарій 3: Повний цикл покупки', () => {

  let testEmail;

  // Перед тестом: реєструємо тестового користувача
  test.beforeEach(async ({ page }) => {
    testEmail = `buyer${Date.now()}@mailtest.com`;
    await registerUser(page, testEmail, 'Buyer User');

    // Перевірка: користувач увійшов
    await expect(
      page.locator('a:has-text("Logged in as")')
    ).toBeVisible();
  });

  // Після тесту: видаляємо акаунт
  test.afterEach(async ({ page }) => {
    await page.goto('/');
    await deleteAccount(page);
  });

  test('Додавання товару до кошика та оформлення покупки', async ({ page }) => {

    // ── КРОК 1: Перехід до каталогу товарів ─────────────────────────
    await page.goto('/products');

    await expect(
      page.locator('.features_items h2.title')
    ).toContainText('All Products');

    // ── КРОК 2: Додавання першого товару до кошика ──────────────────
    // Наводимо мишу на перший товар щоб з'явилась кнопка "Add to cart"
    const firstProduct = page.locator('.product-image-wrapper').first();
    await firstProduct.hover();
    await firstProduct.locator('a.add-to-cart').click();

    // ── КРОК 3: Обробка модального вікна підтвердження ──────────────
    // З'являється модальне вікно з "Added!" та двома кнопками
    await expect(
      page.locator('#cartModal .modal-title')
    ).toContainText('Added!');

    // Натискаємо "Continue Shopping" (залишаємось на сторінці)
    await page.locator('#cartModal button:has-text("Continue Shopping")').click();

    // ── КРОК 4: Перехід до кошика ───────────────────────────────────
    await page.locator('a[href="/view_cart"]').click();

    // Перевірка: кошик відкрився
    await expect(page).toHaveURL(/view_cart/);

    // Перевірка: таблиця кошика відображається
    await expect(page.locator('#cart_info_table')).toBeVisible();

    // Перевірка: в кошику є товари
    const cartItems = await page.locator('tr.cart_menu ~ tr').count();
    expect(cartItems).toBeGreaterThan(0);

    // Перевірка: відображається ціна та кількість
    await expect(
      page.locator('.cart_quantity').first()
    ).toBeVisible();

    // ── КРОК 5: Оформлення замовлення ───────────────────────────────
    await page.locator('a:has-text("Proceed To Checkout")').click();

    // ── КРОК 6: Перевірка адреси доставки ───────────────────────────
    // Оскільки користувач залогінений, з'являється сторінка Checkout
    await expect(page).toHaveURL(/checkout/);

    await expect(
      page.locator('#address_delivery')
    ).toBeVisible();

    // Перевірка: відображається адреса з даних реєстрації
    await expect(
      page.locator('#address_delivery .address_firstname')
    ).toContainText('Buyer');

    // Перевірка: відображається зведення по товарах
    await expect(
      page.locator('#cart_info table')
    ).toBeVisible();

    // ── КРОК 7: Введення коментаря та підтвердження ─────────────────
    await page.locator('textarea.form-control').fill(
      'Тестове замовлення для перевірки E2E сценарію. Прошу обробити.'
    );

    await page.locator('a:has-text("Place Order")').click();

    // ── КРОК 8: Введення платіжних даних ────────────────────────────
    await expect(page).toHaveURL(/payment/);

    await page.locator('[data-qa="name-on-card"]').fill('Buyer User');
    await page.locator('[data-qa="card-number"]').fill('4111111111111111');
    await page.locator('[data-qa="cvc"]').fill('123');
    await page.locator('[data-qa="expiry-month"]').fill('12');
    await page.locator('[data-qa="expiry-year"]').fill('2027');

    // ── КРОК 9: Підтвердження оплати ────────────────────────────────
    await page.locator('[data-qa="pay-button"]').click();

    // ── КРОК 10: Перевірка успішного замовлення ─────────────────────
    // Очікуємо появи підтвердження замовлення
    await expect(
      page.locator('b:has-text("Order Placed!")')
    ).toBeVisible();

    await expect(
      page.locator('p:has-text("Congratulations")')
    ).toBeVisible();

    // Перевірка: URL підтверджує успішне замовлення
    await expect(page).toHaveURL(/payment_done/);
  });

});
