/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login to the application
     * @example cy.login('test@example.com', 'password123')
     */
    login(email: string, password: string): Chainable<void>
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/'); // Visit the home page first
  cy.visit('/auth');
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('form').submit();
  
  // Verify successful login
  cy.url().should('not.include', '/auth');
  cy.get('.navbar-nav').should('contain', 'Logout');
});
