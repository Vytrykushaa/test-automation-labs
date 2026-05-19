// cypress/support/e2e.js
// Глобальна обробка uncaught exception від реклами Google
Cypress.on('uncaught:exception', (err, runnable) => {
  // Повертаємо false — Cypress не завалює тест через помилки сторонніх скриптів
  return false;
});
