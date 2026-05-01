// tests/e2e/scenario2_search.spec.js
// E2E Сценарій 2: Пошук товару та перегляд деталей (перенесено з Lab6)

const { test, expect } = require('@playwright/test');

test.describe('E2E Сценарій 2: Пошук товару та перегляд деталей', () => {

  test('Пошук товару за ключовим словом та перегляд деталей', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/products/);
    await page.waitForSelector('.product-image-wrapper');

    const allCount = await page.locator('.product-image-wrapper').count();
    expect(allCount).toBeGreaterThan(0);

    await page.locator('#search_product').fill('dress');
    await page.locator('#submit_search').click();
    await expect(page.locator('.features_items h2.title')).toContainText('Searched Products');

    const count = await page.locator('.product-image-wrapper').count();
    expect(count).toBeGreaterThan(0);

    await page.locator('.product-image-wrapper').first()
      .locator('a[href*="product_details"]').click();

    await expect(page).toHaveURL(/product_details/);
    await expect(page.locator('.product-information h2')).toBeVisible();
    await expect(page.locator('.product-information p:has-text("Availability:")')).toBeVisible();
    await expect(page.locator('.product-information p:has-text("Condition:")')).toBeVisible();
    await expect(page.locator('.product-information p:has-text("Brand:")')).toBeVisible();
    await expect(page.locator('button:has-text("Add to cart")')).toBeVisible();
  });
});
