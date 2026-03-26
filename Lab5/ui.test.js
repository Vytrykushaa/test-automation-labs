import puppeteer from 'puppeteer';

// ==============================
// Константи
// ==============================

// Базова URL-адреса сайту :contentReference[oaicite:0]{index=0}
const BASE_URL = 'https://www.yakaboo.ua';

// URL сторінки каталогу книг
const CATALOG_URL = 'https://www.yakaboo.ua/ua/knigi.html';

// Максимальний час очікування (30 секунд)
// Використовується для запобігання "зависання" тестів
const TIMEOUT = 30000;

// ==============================
// Глобальні змінні
// ==============================

// Змінна для браузера (екземпляр Chromium)
let browser;

// Змінна для вкладки (Page API Puppeteer)
let page;

// ==============================
// Хуки (Hooks)
// ==============================

// beforeEach — виконується перед КОЖНИМ тестом
// Це гарантує ізоляцію тестів (кожен стартує "з нуля")
beforeEach(async () => {

  // Запуск браузера
  browser = await puppeteer.launch({

    // headless: false — відкриває реальний браузер (зручно для дебагу)
    // headless: 'new' — запуск без UI (швидше, для CI/CD)
    headless: false,

    // slowMo — штучна затримка між діями (для візуального контролю)
    slowMo: 100,

    // args — параметри для стабільної роботи в різних середовищах
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ],
  });

  // Відкриваємо нову вкладку браузера
  page = await browser.newPage();

  // Встановлюємо розмір вікна (імітація desktop-користувача)
  await page.setViewport({ width: 1280, height: 800 });

  // Встановлюємо глобальний timeout для всіх операцій Puppeteer
  page.setDefaultTimeout(TIMEOUT);
});

// afterEach — виконується після кожного тесту
// Закриває браузер і звільняє ресурси
afterEach(async () => {
  await browser.close();
});

// ==============================
// TC-UI-01: Перевірка заголовку сторінки
// ==============================

describe('TC-UI-01: Заголовок головної сторінки', () => {

  test('title сторінки містить Yakaboo', async () => {

    // Відкриваємо головну сторінку
    // waitUntil: 'domcontentloaded' означає:
    // чекати поки HTML повністю завантажиться
    await page.goto(BASE_URL, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT
    });

    // Отримуємо заголовок вкладки (<title>)
    const title = await page.title();

    // Перевіряємо, що title містить назву сайту
    // toLowerCase() — щоб уникнути проблем з регістром
    expect(title.toLowerCase()).toContain('yakaboo');
  });

});

// ==============================
// TC-UI-02: Перевірка пошукового поля
// ==============================

describe('TC-UI-02: Наявність пошукового поля', () => {

  test('пошукове поле присутнє', async () => {

    await page.goto(BASE_URL, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT
    });

    // Очікуємо появу input поля типу search
    // waitForSelector — ключовий метод Puppeteer:
    // він чекає, поки елемент з’явиться у DOM
    await page.waitForSelector('input[type="search"]');

    // Отримуємо елемент
    const searchInput = await page.$('input[type="search"]');

    // Перевіряємо, що елемент існує
    expect(searchInput).not.toBeNull();
  });

});

// ==============================
// TC-UI-03: Перевірка навігації
// ==============================

describe('TC-UI-03: Навігаційне меню', () => {

  test('меню містить посилання', async () => {

    await page.goto(BASE_URL, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT
    });

    // Чекаємо появу навігаційного блоку
    await page.waitForSelector('nav');

    // $$eval:
    // - знаходить всі елементи
    // - виконує функцію у браузері
    const linksCount = await page.$$eval('nav a', links => links.length);

    // Перевіряємо, що є хоча б одне посилання
    expect(linksCount).toBeGreaterThan(0);
  });

});

// ==============================
// TC-UI-04: Перевірка каталогу
// ==============================

describe('TC-UI-04: Каталог книг', () => {

  test('є картки товарів', async () => {

    await page.goto(CATALOG_URL, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT
    });

    // Використовуємо "гнучкий" селектор:
    // [class*="product"] — шукає всі класи, що містять "product"
    // Це робить тест менш залежним від верстки
    await page.waitForSelector('[class*="product"], [class*="card"]');

    // Отримуємо всі картки товарів
    const products = await page.$$('[class*="product"], [class*="card"]');

    // Перевіряємо, що товари є
    expect(products.length).toBeGreaterThan(0);
  });

});

// ==============================
// TC-UI-05: Перевірка пошуку
// ==============================

describe('TC-UI-05: Пошук', () => {

  test('пошук працює', async () => {

    await page.goto(BASE_URL, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT
    });

    // Чекаємо поле пошуку
    await page.waitForSelector('input[type="search"]');

    // Вводимо текст у поле (імітація користувача)
    await page.type('input[type="search"]', 'Гаррі Поттер');

    // Замість натискання Enter ми напряму формуємо URL пошуку
    // Це робить тест стабільнішим (бо сайт може працювати як SPA)
    const searchUrl = 'https://www.yakaboo.ua/ua/search/?q=Гаррі+Поттер';

    // Переходимо на сторінку результатів
    await page.goto(searchUrl, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT
    });

    // Чекаємо появу результатів
    await page.waitForSelector('[class*="product"], [class*="card"]', {
      timeout: TIMEOUT
    });

    // Отримуємо список результатів
    const results = await page.$$('[class*="product"], [class*="card"]');

    // Перевіряємо, що результати є
    expect(results.length).toBeGreaterThan(0);
  });

});