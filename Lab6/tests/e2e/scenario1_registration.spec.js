// tests/e2e/scenario1_registration.spec.js
// ============================================================
// СЦЕНАРІЙ 1: Реєстрація нового користувача
// ============================================================
// Кроки сценарію:
//  1. Відкрити головну сторінку сайту
//  2. Перейти на сторінку реєстрації / входу
//  3. Ввести ім'я та email у форму "New User Signup!"
//  4. Натиснути кнопку "Signup"
//  5. Заповнити детальну форму акаунту (пароль, дата, адреса)
//  6. Натиснути "Create Account"
//  7. Перевірити повідомлення "Account Created!"
//  8. Натиснути "Continue" та перевірити, що користувач увійшов
//  9. Видалити акаунт (прибирання)
// ============================================================

const { test, expect } = require('@playwright/test');
const { deleteAccount } = require('../helpers/registration');

test.describe('Сценарій 1: Реєстрація нового користувача', () => {

  test('Успішна реєстрація нового акаунту', async ({ page }) => {

    // Генеруємо унікальний email для кожного запуску тесту
    const timestamp = Date.now();
    const testEmail = `testuser${timestamp}@mailtest.com`;
    const testName = 'Test User';

    // ── КРОК 1: Відкриття головної сторінки ─────────────────────────
    await page.goto('/');

    // Перевірка: головна сторінка завантажилась
    await expect(page).toHaveTitle(/Automation Exercise/);
    await expect(page.locator('img.logo.pull-left')).toBeVisible();

    // ── КРОК 2: Перехід на сторінку реєстрації ──────────────────────
    await page.locator('a[href="/login"]').click();

    // Перевірка: відображається заголовок "New User Signup!"
    await expect(page.locator('h2:has-text("New User Signup!")')).toBeVisible();

    // ── КРОК 3: Заповнення форми "New User Signup!" ──────────────────
    await page.locator('[data-qa="signup-name"]').fill(testName);
    await page.locator('[data-qa="signup-email"]').fill(testEmail);

    // ── КРОК 4: Натиснути кнопку Signup ─────────────────────────────
    await page.locator('[data-qa="signup-button"]').click();

    // Перевірка: відображається форма "Enter Account Information"
    await expect(
      page.locator('b:has-text("Enter Account Information")')
    ).toBeVisible();

    // ── КРОК 5: Заповнення деталей акаунту ──────────────────────────

    // Стать
    await page.locator('#id_gender1').check();

    // Пароль
    await page.locator('[data-qa="password"]').fill('Test@12345');

    // Дата народження
    await page.locator('[data-qa="days"]').selectOption('15');
    await page.locator('[data-qa="months"]').selectOption('6');
    await page.locator('[data-qa="years"]').selectOption('1995');

    // Підписка на розсилку
    await page.locator('#newsletter').check();
    await page.locator('#optin').check();

    // Особисті дані
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

    // ── КРОК 6: Натиснути "Create Account" ──────────────────────────
    await page.locator('[data-qa="create-account"]').click();

    // ── КРОК 7: Перевірка успішної реєстрації ───────────────────────
    await expect(
      page.locator('b:has-text("Account Created!")')
    ).toBeVisible();

    await expect(
      page.locator('[data-qa="account-created"]')
    ).toBeVisible();

    // ── КРОК 8: Натиснути Continue і перевірити вхід ────────────────
    await page.locator('[data-qa="continue-button"]').click();

    // Перевірка: в навігаційній панелі з'явилось ім'я користувача
    await expect(
      page.locator(`a:has-text("Logged in as")`)
    ).toBeVisible();

    await expect(
      page.locator(`li:has-text("${testName}")`)
    ).toBeVisible();

    // ── КРОК 9: Видалення акаунту (прибирання) ──────────────────────
    await deleteAccount(page);

    // Перевірка: акаунт видалено успішно
    await expect(
      page.locator('b:has-text("Account Deleted!")')
    ).toBeVisible();
  });

});
