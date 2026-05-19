// test/specs/test3_search.spec.js
// WebdriverIO UI Тест 3: Перевірка функціоналу пошуку

describe('WebdriverIO Тест 3: Пошук товару', () => {

  beforeEach(async () => {
    await browser.url('/products');
    const firstCard = await $('.product-image-wrapper');
    await firstCard.waitForDisplayed({ timeout: 15000 });
  });

  it('поле пошуку та кнопка відображаються на сторінці Products', async () => {
    const searchInput = await $('#search_product');
    const searchButton = await $('#submit_search');
    await expect(searchInput).toBeDisplayed();
    await expect(searchButton).toBeDisplayed();
  });

  it('пошук за словом "dress" повертає результати', async () => {
    await $('#search_product').setValue('dress');
    // ВИПРАВЛЕННЯ: клік через JavaScript — обходить рекламний iframe
    await browser.execute(() => {
      document.querySelector('#submit_search').click();
    });
    const title = await $('.features_items h2.title');
    await title.waitForDisplayed({ timeout: 15000 });
    // ВИПРАВЛЕННЯ: сайт відображає текст у верхньому регістрі "SEARCHED PRODUCTS"
    const titleText = await title.getText();
    expect(titleText.toUpperCase()).toContain('SEARCHED PRODUCTS');
    const results = await $$('.product-image-wrapper');
    expect(results.length).toBeGreaterThan(0);
  });

  it('сторінка деталей товару відкривається після кліку', async () => {
    await $('#search_product').setValue('dress');
    // ВИПРАВЛЕННЯ: JS клік обходить рекламний iframe що перекриває кнопку
    await browser.execute(() => {
      document.querySelector('#submit_search').click();
    });
    const firstProduct = await $('.product-image-wrapper');
    await firstProduct.waitForDisplayed({ timeout: 15000 });
    const viewLink = await firstProduct.$('a[href*="product_details"]');
    // JS клік на посилання товару
    await browser.execute((el) => el.click(), viewLink);
    await browser.waitUntil(
      async () => (await browser.getUrl()).includes('product_details'),
      { timeout: 15000, timeoutMsg: 'URL не змінився на product_details' }
    );
    const productTitle = await $('.product-information h2');
    await expect(productTitle).toBeDisplayed();
  });
});
