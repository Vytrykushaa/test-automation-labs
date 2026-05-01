// tests/e2e/scenario1_registration.spec.js
// E2E Сценарій 1: Реєстрація нового користувача (перенесено з Lab6)

const { test, expect } = require('@playwright/test');
const { deleteAccount } = require('../helpers/registration');
const { generateUniqueEmail } = require('../../core/helpers/utils');

test.describe('E2E Сценарій 1: Реєстрація нового користувача', () => {

  test('Успішна реєстрація нового акаунту', async ({ page }) => {
    const testEmail = generateUniqueEmail('testuser');
    const testName = 'Test User';

    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);

    await page.locator('a[href="/login"]').click();
    await expect(page.locator('h2:has-text("New User Signup!")')).toBeVisible();

    await page.locator('[data-qa="signup-name"]').fill(testName);
    await page.locator('[data-qa="signup-email"]').fill(testEmail);
    await page.locator('[data-qa="signup-button"]').click();

    await expect(page.locator('b:has-text("Enter Account Information")')).toBeVisible();

    await page.locator('#id_gender1').check();
    await page.locator('[data-qa="password"]').fill('Test@12345');
    await page.locator('[data-qa="days"]').selectOption('15');
    await page.locator('[data-qa="months"]').selectOption('6');
    await page.locator('[data-qa="years"]').selectOption('1995');
    await page.locator('#newsletter').check();
    await page.locator('#optin').check();
    await page.locator('[data-qa="first_name"]').fill('Test');
    await page.locator('[data-qa="last_name"]').fill('User');
    await page.locator('[data-qa="company"]').fill('Test Company');
    await page.locator('[data-qa="address"]').fill('123 Automation Street');
    await page.locator('[data-qa="address2"]').fill('Suite 100');
    await page.locator('[data-qa="country"]').selectOption('United States');
    await page.locator('[data-qa="state"]').fill('California');
    await page.locator('[data-qa="city"]').fill('Los Angeles');
    await page.locator('[data-qa="zipcode"]').fill('90001');
    await page.locator('[data-qa="mobile_number"]').fill('3105551234');
    await page.locator('[data-qa="create-account"]').click();

    await expect(page.locator('b:has-text("Account Created!")')).toBeVisible();
    await page.locator('[data-qa="continue-button"]').click();
    await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();
    await expect(page.locator(`li:has-text("${testName}")`)).toBeVisible();

    await deleteAccount(page);
    await expect(page.locator('b:has-text("Account Deleted!")')).toBeVisible();
  });
});
