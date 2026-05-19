// cypress/e2e/test2_products.cy.js
// Cypress UI Тест 2: Перевірка сторінки каталогу Products

describe('Cypress Тест 2: Сторінка Products', () => {

  beforeEach(() => {
    cy.visit('/products');
  });

  it('сторінка Products завантажується за прямим URL', () => {
    cy.url().should('include', '/products');
  });

  it('відображається список товарів (кількість > 0)', () => {
    // Чекаємо появи карток товарів
    cy.get('.product-image-wrapper').should('have.length.greaterThan', 0);
  });

  it('картка першого товару містить назву та ціну', () => {
    cy.get('.product-image-wrapper').first().within(() => {
      cy.get('.productinfo p').should('be.visible');
      cy.get('.productinfo h2').should('be.visible');
    });
  });
});
