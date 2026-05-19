// test/specs/test1_homepage.spec.js
// WebdriverIO UI Тест 1: Перевірка головної сторінки

describe('WebdriverIO Тест 1: Головна сторінка', () => {

  it('повинна завантажитись головна сторінка з коректним заголовком', async () => {
    await browser.url('/products');
    const title = await browser.getTitle();
    expect(title).toContain('Automation Exercise');
  });

  it('повинна відображатись навігаційна панель з пунктами меню', async () => {
    await browser.url('/products');
    const productsLink = await $('a[href="/products"]');
    const loginLink = await $('a[href="/login"]');
    await expect(productsLink).toBeDisplayed();
    await expect(loginLink).toBeDisplayed();
  });

  it('повинен відображатись блок з товарами на сторінці', async () => {
    await browser.url('/products');
    const firstCard = await $('.product-image-wrapper');
    await firstCard.waitForDisplayed({ timeout: 15000 });
    const products = await $$('.product-image-wrapper');
    expect(products.length).toBeGreaterThan(0);
  });
});
