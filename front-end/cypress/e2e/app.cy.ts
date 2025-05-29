describe('Recipe Book Application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the recipe book header', () => {
    cy.get('.navbar-brand').should('contain.text', 'Recipe Book');
  });

  it('should have navigation links', () => {
    cy.get('.nav').should('exist');
    cy.contains('Recipes').should('exist');
    cy.contains('Shopping List').should('exist');
  });

  it('should navigate to recipes page', () => {
    cy.contains('Recipes').click();
    cy.url().should('include', '/recipes');
  });

  it('should navigate to shopping list page', () => {
    cy.contains('Shopping List').click();
    cy.url().should('include', '/shopping-list');
  });
});
