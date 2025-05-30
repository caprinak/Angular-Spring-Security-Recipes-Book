describe('Recipe Book Application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the recipe book header', () => {
    cy.get('.navbar-brand').should('contain.text', 'Recipe Book');
  });
  it('should have navigation links', () => {
    cy.get('.navbar-nav').should('exist');
    cy.contains('Recipe Book').should('exist');
    cy.contains('Shopping List').should('exist');
    cy.contains('Authenticate').should('exist');
  });
  it('should navigate to recipe book page', () => {
    //cy.contains('Recipe Book').click();
    cy.url().should('include', '/recipe-book');
  });

  it('should navigate to shopping list page', () => {
    cy.contains('Shopping List').click();
    cy.url().should('include', '/shopping-list');
  });
});
