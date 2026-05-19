// cypress/e2e/test3_search.cy.js
// Cypress UI Тест 3: Перевірка функціоналу пошуку

describe('Cypress Тест 3: Пошук товару', () => {

  beforeEach(() => {
    cy.visit('/products');
    cy.get('.product-image-wrapper').should('have.length.greaterThan', 0);
  });

  it('поле пошуку та кнопка відображаються на сторінці Products', () => {
    cy.get('#search_product').should('be.visible');
    cy.get('#submit_search').should('be.visible');
  });

  it('пошук за словом "dress" повертає результати', () => {
    cy.get('#search_product').type('dress');
    cy.get('#submit_search').click();
    // Перевірка заголовку результатів
    cy.get('.features_items h2.title').should('contain.text', 'Searched Products');
    // Перевірка що знайдено товари
    cy.get('.product-image-wrapper').should('have.length.greaterThan', 0);
  });

  it('сторінка деталей товару відкривається після кліку "View Product"', () => {
    cy.get('#search_product').type('dress');
    cy.get('#submit_search').click();
    cy.get('.product-image-wrapper').first()
      .find('a[href*="product_details"]')
      .click();
    cy.url().should('include', 'product_details');
    cy.get('.product-information h2').should('be.visible');
  });
});