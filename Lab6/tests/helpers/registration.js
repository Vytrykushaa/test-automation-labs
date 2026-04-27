// tests/helpers/registration.js

/**
 * Реєструє нового користувача на сайті automationexercise.com
 */
async function registerUser(page, email, name = 'Test User') {
  // waitUntil: domcontentloaded — уникає ERR_ABORTED при завантаженні
  await page.goto('/login', { waitUntil: 'domcontentloaded' });

  await page.locator('[data-qa="signup-name"]').fill(name);
  await page.locator('[data-qa="signup-email"]').fill(email);
  await page.locator('[data-qa="signup-button"]').click();

  await page.locator('#id_gender1').check();
  await page.locator('[data-qa="password"]').fill('Test@12345');
  await page.locator('[data-qa="days"]').selectOption('15');
  await page.locator('[data-qa="months"]').selectOption('6');
  await page.locator('[data-qa="years"]').selectOption('1995');

  await page.locator('[data-qa="first_name"]').fill(name.split(' ')[0]);
  await page.locator('[data-qa="last_name"]').fill(name.split(' ')[1] || 'User');
  await page.locator('[data-qa="address"]').fill('123 Test Street');
  await page.locator('[data-qa="country"]').selectOption('United States');
  await page.locator('[data-qa="state"]').fill('California');
  await page.locator('[data-qa="city"]').fill('Los Angeles');
  await page.locator('[data-qa="zipcode"]').fill('90001');
  await page.locator('[data-qa="mobile_number"]').fill('1234567890');

  await page.locator('[data-qa="create-account"]').click();
  await page.locator('[data-qa="continue-button"]').click();
}

/**
 * Видаляє обліковий запис
 */
async function deleteAccount(page) {
  const deleteLink = page.locator('a[href="/delete_account"]');
  if (await deleteLink.isVisible()) {
    await deleteLink.click();
  }
}

module.exports = { registerUser, deleteAccount };
