// tests/api/products.api.spec.js
// API-тести: перевіряють REST API сайту AutomationExercise.com

const { test, expect } = require('@playwright/test');
const config = require('../../core/config');

test.describe('API: AutomationExercise REST API', () => {

  test('API-01: GET /api/productsList повертає статус 200 та масив товарів', async ({ request }) => {
    const response = await request.get(`${config.API_URL}/productsList`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('API-02: GET /api/brandsList повертає статус 200 та масив брендів', async ({ request }) => {
    const response = await request.get(`${config.API_URL}/brandsList`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.brands)).toBe(true);
    expect(body.brands.length).toBeGreaterThan(0);
  });

  test('API-03: POST /api/searchProduct з запитом "dress" повертає результати', async ({ request }) => {
    const response = await request.post(`${config.API_URL}/searchProduct`, {
      form: { search_product: 'dress' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('API-04: POST /api/searchProduct без параметра повертає 400', async ({ request }) => {
    const response = await request.post(`${config.API_URL}/searchProduct`, {
      form: {},
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    // API повертає responseCode 400 при відсутності параметра
    expect(body.responseCode).toBe(400);
  });

  test('API-05: POST /api/verifyLogin з неправильним паролем повертає помилку', async ({ request }) => {
    const response = await request.post(`${config.API_URL}/verifyLogin`, {
      form: {
        email: 'wrong@email.com',
        password: 'wrongpassword',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    // API повертає responseCode 404 якщо користувач не знайдений
    expect(body.responseCode).toBe(404);
  });

  test('API-06: GET /api/productsList — кожен товар має обовязкові поля', async ({ request }) => {
    const response = await request.get(`${config.API_URL}/productsList`);
    const body = await response.json();
    const firstProduct = body.products[0];
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('name');
    expect(firstProduct).toHaveProperty('price');
    expect(firstProduct).toHaveProperty('brand');
    expect(firstProduct).toHaveProperty('category');
  });

  test('API-07: PUT /api/searchProduct повертає 405 (метод не дозволено)', async ({ request }) => {
    const response = await request.put(`${config.API_URL}/searchProduct`, {
      form: { search_product: 'dress' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(405);
  });
});
