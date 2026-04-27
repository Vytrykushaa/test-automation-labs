// tests/e2e/scenario2_search.spec.js
// СЦЕНАРІЙ 2: Пошук товару та перегляд деталей

const { test, expect } = require('@playwright/test');

test.describe('Сценарій 2: Пошук товару та перегляд деталей', () => {

  test('Пошук товару за ключовим словом та перегляд деталей', async ({ page }) => {

    const searchQuery = 'dress';

    // КРОК 1: Головна сторінка
    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    // КРОК 2: Перехід на Products напряму через goto
    // (уникаємо Google vignette реклами яка перехоплює клік по навігації)
    await page.goto('/products');
    await expect(page).toHaveURL(/products/);

    // КРОК 3: Перевірка наявності товарів
    await page.waitForSelector('.product-image-wrapper');
    const allCount = await page.locator('.product-image-wrapper').count();
    expect(allCount).toBeGreaterThan(0);

    // КРОК 4-5: Пошук товару
    await page.locator('#search_product').fill(searchQuery);
    await page.locator('#submit_search').click();

    // Перевірка заголовку результатів
    await expect(
      page.locator('.features_items h2.title')
    ).toContainText('Searched Products');

    // Перевірка кількості результатів
    const count = await page.locator('.product-image-wrapper').count();
    expect(count).toBeGreaterThan(0);

    // КРОК 6: Перехід на деталі першого товару
    await page
      .locator('.product-image-wrapper')
      .first()
      .locator('a[href*="product_details"]')
      .click();

    // КРОК 7: Перевірка інформації про товар
    await expect(page).toHaveURL(/product_details/);
    await expect(page.locator('.product-information h2')).toBeVisible();
    await expect(
      page.locator('.product-information p:has-text("Category:")')
    ).toBeVisible();
    await expect(
      page.locator('.product-information span').filter({ hasText: 'Rs.' }).first()
    ).toBeVisible();
    await expect(
      page.locator('.product-information p:has-text("Availability:")')
    ).toBeVisible();
    await expect(
      page.locator('.product-information p:has-text("Condition:")')
    ).toBeVisible();
    await expect(
      page.locator('.product-information p:has-text("Brand:")')
    ).toBeVisible();
    await expect(
      page.locator('button:has-text("Add to cart")')
    ).toBeVisible();
  });

});
