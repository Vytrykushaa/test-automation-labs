// cypress/e2e/test1_homepage.cy.js
// Cypress UI Тест 1: Перевірка головної сторінки

describe('Cypress Тест 1: Головна сторінка', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  it('повинна завантажитись головна сторінка з коректним заголовком', () => {
    // Перевірка заголовку вкладки браузера
    cy.title().should('include', 'Automation Exercise');
  });

  it('повинна відображатись навігаційна панель з пунктами меню', () => {
    // Перевірка наявності основних пунктів навігації
    cy.get('a[href="/products"]').should('be.visible');
    cy.get('a[href="/login"]').should('be.visible');
    cy.get('a[href="/view_cart"]').first().should('be.visible');
  });

  it('повинен відображатись блок з товарами на головній сторінці', () => {
    // Перевірка що секція з фічами товарів завантажилась
    cy.get('.features_items').should('be.visible');
    cy.get('.product-image-wrapper').should('have.length.greaterThan', 0);
  });
});
