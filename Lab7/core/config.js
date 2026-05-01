// core/config.js
// Ядро: централізована конфігурація всього рішення (принцип DRY)
module.exports = {
  BASE_URL: 'https://automationexercise.com',
  API_URL: 'https://automationexercise.com/api',
  TIMEOUTS: {
    action: 20000,
    navigation: 45000,
    expect: 15000,
  },
  VIEWPORT: { width: 1366, height: 768 },
  TEST_USER: {
    password: 'Test@12345',
    firstName: 'Test',
    lastName: 'User',
    company: 'Test Company',
    address: '123 Test Street',
    address2: 'Suite 100',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    zipcode: '90001',
    mobile: '1234567890',
    day: '15',
    month: '6',
    year: '1995',
  },
  PAYMENT: {
    nameOnCard: 'Test User',
    cardNumber: '4111111111111111',
    cvc: '123',
    expiryMonth: '12',
    expiryYear: '2027',
  },
};
