// test/specs/test2_products.spec.js
// WebdriverIO UI Тест 2: Перевірка сторінки каталогу Products

describe('WebdriverIO Тест 2: Сторінка Products', () => {

  it('сторінка Products завантажується за прямим URL', async () => {
    await browser.url('/products');
    const url = await browser.getUrl();
    expect(url).toContain('/products');
  });

  it('відображається список товарів (кількість > 0)', async () => {
    await browser.url('/products');
    // Чекаємо появи першої картки товару
    const firstCard = await $('.product-image-wrapper');
    await firstCard.waitForDisplayed({ timeout: 15000 });
    const products = await $$('.product-image-wrapper');
    expect(products.length).toBeGreaterThan(0);
  });

  it('картка першого товару містить назву та ціну', async () => {
    await browser.url('/products');
    const firstCard = await $('.product-image-wrapper');
    await firstCard.waitForDisplayed({ timeout: 15000 });
    const productName = await firstCard.$('.productinfo p');
    const productPrice = await firstCard.$('.productinfo h2');
    await expect(productName).toBeDisplayed();
    await expect(productPrice).toBeDisplayed();
  });
});
