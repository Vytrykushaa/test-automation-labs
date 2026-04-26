// tests/e2e/scenario2_search.spec.js
// ============================================================
// СЦЕНАРІЙ 2: Пошук товару та перегляд деталей
// ============================================================
// Кроки сценарію:
//  1. Відкрити головну сторінку сайту
//  2. Перейти на сторінку "Products"
//  3. Перевірити відображення всіх товарів
//  4. Ввести пошуковий запит "dress" у поле пошуку
//  5. Натиснути кнопку пошуку
//  6. Перевірити що відображається заголовок "Searched Products"
//  7. Перевірити що знайдено більше 0 товарів
//  8. Перейти на сторінку деталей першого знайденого товару
//  9. Перевірити відображення повної інформації про товар
// ============================================================

const { test, expect } = require('@playwright/test');

test.describe('Сценарій 2: Пошук товару та перегляд деталей', () => {

  test('Пошук товару за ключовим словом та перегляд деталей', async ({ page }) => {

    const searchQuery = 'dress';

    // ── КРОК 1: Відкриття головної сторінки ─────────────────────────
    await page.goto('/');

    await expect(page).toHaveTitle(/Automation Exercise/);

    // ── КРОК 2: Перехід на сторінку Products ────────────────────────
    await page.locator('a[href="/products"]').click();

    // Перевірка: відображається заголовок "All Products"
    await expect(
      page.locator('.features_items h2.title')
    ).toContainText('All Products');

    // ── КРОК 3: Перевірка відображення товарів ──────────────────────
    // На сторінці Products мають бути товари до пошуку
    const allProductsCount = await page.locator('.product-image-wrapper').count();
    expect(allProductsCount).toBeGreaterThan(0);

    // ── КРОК 4: Введення пошукового запиту ──────────────────────────
    await page.locator('#search_product').fill(searchQuery);

    // ── КРОК 5: Натискання кнопки пошуку ────────────────────────────
    await page.locator('#submit_search').click();

    // ── КРОК 6: Перевірка заголовку результатів пошуку ──────────────
    await expect(
      page.locator('.features_items h2.title')
    ).toContainText('Searched Products');

    // ── КРОК 7: Перевірка кількості знайдених товарів ───────────────
    const searchResultsCount = await page.locator('.product-image-wrapper').count();
    expect(searchResultsCount).toBeGreaterThan(0);

    // Перевірка: кожен знайдений товар відображає назву та ціну
    const firstProductName = await page
      .locator('.product-image-wrapper')
      .first()
      .locator('.productinfo p')
      .textContent();
    expect(firstProductName).toBeTruthy();

    // ── КРОК 8: Перехід на сторінку деталей першого товару ──────────
    await page
      .locator('.product-image-wrapper')
      .first()
      .locator('a:has-text("View Product")')
      .click();

    // ── КРОК 9: Перевірка інформації про товар ──────────────────────

    // Назва товару
    await expect(
      page.locator('.product-information h2')
    ).toBeVisible();

    // Категорія
    await expect(
      page.locator('.product-information p:has-text("Category:")')
    ).toBeVisible();

    // Ціна
    await expect(
      page.locator('.product-information span span.orange.font-weight-bold')
    ).toBeVisible();

    // Наявність
    await expect(
      page.locator('.product-information p:has-text("Availability:")')
    ).toBeVisible();

    // Стан
    await expect(
      page.locator('.product-information p:has-text("Condition:")')
    ).toBeVisible();

    // Бренд
    await expect(
      page.locator('.product-information p:has-text("Brand:")')
    ).toBeVisible();

    // Кількість та кнопка "Add to cart"
    await expect(
      page.locator('button:has-text("Add to cart")')
    ).toBeVisible();

    // Перевірка: URL сторінки містить product_details
    await expect(page).toHaveURL(/product_details/);
  });

});
