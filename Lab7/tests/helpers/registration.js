// tests/helpers/registration.js
const config = require('../../core/config');

async function registerUser(page, email, name = 'Test User') {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-qa="signup-name"]').fill(name);
  await page.locator('[data-qa="signup-email"]').fill(email);
  await page.locator('[data-qa="signup-button"]').click();
  await page.locator('#id_gender1').check();
  await page.locator('[data-qa="password"]').fill(config.TEST_USER.password);
  await page.locator('[data-qa="days"]').selectOption(config.TEST_USER.day);
  await page.locator('[data-qa="months"]').selectOption(config.TEST_USER.month);
  await page.locator('[data-qa="years"]').selectOption(config.TEST_USER.year);
  await page.locator('[data-qa="first_name"]').fill(name.split(' ')[0]);
  await page.locator('[data-qa="last_name"]').fill(name.split(' ')[1] || 'User');
  await page.locator('[data-qa="address"]').fill(config.TEST_USER.address);
  await page.locator('[data-qa="country"]').selectOption(config.TEST_USER.country);
  await page.locator('[data-qa="state"]').fill(config.TEST_USER.state);
  await page.locator('[data-qa="city"]').fill(config.TEST_USER.city);
  await page.locator('[data-qa="zipcode"]').fill(config.TEST_USER.zipcode);
  await page.locator('[data-qa="mobile_number"]').fill(config.TEST_USER.mobile);
  await page.locator('[data-qa="create-account"]').click();
  await page.locator('[data-qa="continue-button"]').click();
}

async function deleteAccount(page) {
  const link = page.locator('a[href="/delete_account"]');
  if (await link.isVisible()) await link.click();
}

module.exports = { registerUser, deleteAccount };
