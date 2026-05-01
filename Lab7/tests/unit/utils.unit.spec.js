// tests/unit/utils.unit.spec.js
// Unit-тести: перевіряють чисті функції з core/helpers/utils.js без браузера

const { test, expect } = require('@playwright/test');
const {
  validateEmail,
  generateUniqueEmail,
  formatPrice,
  isValidCardNumber,
  parseSearchQuery,
  buildFullName,
} = require('../../core/helpers/utils');

test.describe('Unit: validateEmail()', () => {
  test('повертає true для коректного email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('buyer_123@mailtest.com')).toBe(true);
  });

  test('повертає false для email без @', () => {
    expect(validateEmail('notanemail')).toBe(false);
  });

  test('повертає false для email без домену', () => {
    expect(validateEmail('user@')).toBe(false);
  });

  test('повертає false для нерядкового значення', () => {
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(123)).toBe(false);
  });
});

test.describe('Unit: generateUniqueEmail()', () => {
  test('повертає рядок що містить @ та mailtest.com', () => {
    const email = generateUniqueEmail('buyer');
    expect(email).toContain('@');
    expect(email).toContain('mailtest.com');
    expect(email).toContain('buyer');
  });

  test('повертає унікальний email при кожному виклику', async () => {
    const e1 = generateUniqueEmail();
    await new Promise(r => setTimeout(r, 2));
    const e2 = generateUniqueEmail();
    expect(e1).not.toBe(e2);
  });
});

test.describe('Unit: formatPrice()', () => {
  test('форматує число як рупії з двома знаками', () => {
    expect(formatPrice(500)).toBe('Rs. 500.00');
  });

  test('форматує рядок з числом', () => {
    expect(formatPrice('1200')).toBe('Rs. 1200.00');
  });

  test('повертає Rs. 0.00 для нечислового значення', () => {
    expect(formatPrice('abc')).toBe('Rs. 0.00');
  });
});

test.describe('Unit: isValidCardNumber()', () => {
  test('повертає true для валідного номера Visa (алгоритм Луна)', () => {
    expect(isValidCardNumber('4111111111111111')).toBe(true);
  });

  test('повертає false для невалідного номера', () => {
    expect(isValidCardNumber('1234567890123456')).toBe(false);
  });

  test('повертає false для занадто короткого номера', () => {
    expect(isValidCardNumber('123')).toBe(false);
  });
});

test.describe('Unit: parseSearchQuery()', () => {
  test('обрізає пробіли та переводить у нижній регістр', () => {
    expect(parseSearchQuery('  Dress  ')).toBe('dress');
    expect(parseSearchQuery('JEANS')).toBe('jeans');
  });

  test('повертає порожній рядок для ненрядкового значення', () => {
    expect(parseSearchQuery(null)).toBe('');
  });
});

test.describe('Unit: buildFullName()', () => {
  test('об\'єднує ім\'я та прізвище через пробіл', () => {
    expect(buildFullName('Test', 'User')).toBe('Test User');
  });

  test('обрізає зайві пробіли', () => {
    expect(buildFullName('Test', '')).toBe('Test');
  });
});
