import axios from 'axios';

// Базова URL-адреса API
const BASE_URL = 'https://jsonplaceholder.typicode.com';

// =====================================================
// Набір 1: GET /posts — отримання всіх записів
// =====================================================
describe('GET /posts — отримання всіх записів', () => {
  let response;

  beforeEach(async () => {
    response = await axios.get(`${BASE_URL}/posts`);
  });

  test('статус-код відповіді дорівнює 200', () => {
    expect(response.status).toBe(200);
  });

  test('тіло відповіді є масивом', () => {
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('масив не є порожнім', () => {
    expect(response.data.length).toBeGreaterThan(0);
  });

  test('масив містить рівно 100 елементів', () => {
    expect(response.data.length).toBe(100);
  });

  test('кожен елемент масиву має поля userId, id, title, body', () => {
    response.data.forEach(post => {
      expect(post).toHaveProperty('userId');
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');
    });
  });

});

// =====================================================
// Набір 2: GET /posts/:id — отримання конкретного запису
// =====================================================
describe('GET /posts/:id — отримання конкретного запису', () => {
  let response;

  beforeEach(async () => {
    response = await axios.get(`${BASE_URL}/posts/1`);
  });

  test('статус-код відповіді дорівнює 200', () => {
    expect(response.status).toBe(200);
  });

  test('тіло відповіді є обʼєктом, а не масивом', () => {
    expect(typeof response.data).toBe('object');
    expect(Array.isArray(response.data)).toBe(false);
  });

  test('поле id у відповіді дорівнює 1', () => {
    expect(response.data.id).toBe(1);
  });

  test('поля title та body є рядками', () => {
    expect(typeof response.data.title).toBe('string');
    expect(typeof response.data.body).toBe('string');
  });

  test('поле userId є числом більшим за 0', () => {
    expect(typeof response.data.userId).toBe('number');
    expect(response.data.userId).toBeGreaterThan(0);
  });

});

// =====================================================
// Набір 3: POST /posts — створення нового запису
// =====================================================
describe('POST /posts — створення нового запису', () => {
  const newPost = {
    title: 'Тестовий заголовок',
    body: 'Тестовий зміст публікації',
    userId: 4,
  };
  let response;

  beforeEach(async () => {
    response = await axios.post(`${BASE_URL}/posts`, newPost);
  });

  test('статус-код відповіді дорівнює 201 (Created)', () => {
    expect(response.status).toBe(201);
  });

  test('відповідь містить поле id', () => {
    expect(response.data).toHaveProperty('id');
  });

  test('поле id у відповіді є числом', () => {
    expect(typeof response.data.id).toBe('number');
  });

  test('поле title у відповіді відповідає надісланим даним', () => {
    expect(response.data.title).toBe(newPost.title);
  });

  test('поле userId у відповіді відповідає надісланим даним', () => {
    expect(response.data.userId).toBe(newPost.userId);
  });

});

// =====================================================
// Набір 4: PUT /posts/:id — оновлення запису
// =====================================================
describe('PUT /posts/:id — повне оновлення запису', () => {
  const updatedPost = {
    id: 1,
    title: 'Оновлений заголовок',
    body: 'Оновлений зміст',
    userId: 4,
  };
  let response;

  beforeEach(async () => {
    response = await axios.put(`${BASE_URL}/posts/1`, updatedPost);
  });

  test('статус-код відповіді дорівнює 200', () => {
    expect(response.status).toBe(200);
  });

  test('поле id у відповіді дорівнює 1', () => {
    expect(response.data.id).toBe(1);
  });

  test('поле title оновлено коректно', () => {
    expect(response.data.title).toBe(updatedPost.title);
  });

  test('поле body оновлено коректно', () => {
    expect(response.data.body).toBe(updatedPost.body);
  });

  test('поле userId збережено коректно', () => {
    expect(response.data.userId).toBe(updatedPost.userId);
  });

});

// =====================================================
// Набір 5: DELETE /posts/:id — видалення запису
// =====================================================
describe('DELETE /posts/:id — видалення запису', () => {
  let response;

  beforeEach(async () => {
    response = await axios.delete(`${BASE_URL}/posts/1`);
  });

  test('статус-код відповіді дорівнює 200', () => {
    expect(response.status).toBe(200);
  });

  test('тіло відповіді є обʼєктом', () => {
    expect(typeof response.data).toBe('object');
  });

  test('тіло відповіді є порожнім обʼєктом {}', () => {
    expect(Object.keys(response.data).length).toBe(0);
  });

  test('заголовок Content-Type містить application/json', () => {
    expect(response.headers['content-type']).toContain('application/json');
  });

  test('відповідь не містить поле id видаленого ресурсу', () => {
    expect(response.data).not.toHaveProperty('id');
  });

});