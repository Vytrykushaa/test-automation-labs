// core/helpers/utils.js
// Ядро: чисті утиліти без залежностей від браузера

function validateEmail(email) {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateUniqueEmail(prefix = 'test') {
  return `${prefix}_${Date.now()}@mailtest.com`;
}

function formatPrice(price) {
  const num = parseFloat(price);
  if (isNaN(num)) return 'Rs. 0.00';
  return `Rs. ${num.toFixed(2)}`;
}

function isValidCardNumber(number) {
  const digits = String(number).replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

function parseSearchQuery(query) {
  if (typeof query !== 'string') return '';
  return query.trim().toLowerCase();
}

function buildFullName(firstName, lastName) {
  return `${firstName} ${lastName}`.trim();
}

module.exports = { validateEmail, generateUniqueEmail, formatPrice, isValidCardNumber, parseSearchQuery, buildFullName };
