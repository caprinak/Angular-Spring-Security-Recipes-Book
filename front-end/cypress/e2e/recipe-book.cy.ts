describe('Recipe Book Component', () => {
  const testEmail = 'test@example.com';
  const testPassword = 'test123';

  before(() => {
    // Login once before all tests
    cy.login(testEmail, testPassword);
  });

  beforeEach(() => {
    // Start from recipe book page
    cy.visit('/recipe-book');
  });

  it('should fetch and display recipes from server', () => {
    // Click manage dropdown and fetch data
    cy.get('.dropdown-toggle').contains('Manage').click();
    cy.get('.dropdown-item').contains('Fetch Data').click();

    // Verify recipes are loaded
    cy.get('.list-group-item').should('have.length.greaterThan', 0);
    cy.get('.list-group-item-heading').should('exist');
    cy.get('.list-group-item-text').should('exist');
  });

  it('should filter recipes by category', () => {
    // Wait for recipes to load
    cy.get('.list-group-item').should('exist');

    // Get initial recipe count
    cy.get('.list-group-item').its('length').as('initialCount');

    // Click on a category filter (assuming you have category buttons/filters)
    cy.get('.category-filter').first().click();

    // Verify filtered results
    cy.get('.list-group-item').its('length').should('be.lte', '@initialCount');
  });

  it('should add recipes to favorites and show in my-recipes', () => {
    // Add first recipe to favorites
    cy.get('.list-group-item').first().within(() => {
      cy.get('.favorite-btn').click();
      // Verify favorite status
      cy.get('.favorite-btn').should('have.class', 'active');
    });

    // Add second recipe to favorites
    cy.get('.list-group-item').eq(1).within(() => {
      cy.get('.favorite-btn').click();
      cy.get('.favorite-btn').should('have.class', 'active');
    });

    // Navigate to My Recipes
    cy.contains('My Recipes').click();
    cy.url().should('include', '/my-recipes');

    // Verify favorite recipes appear in My Recipes
    cy.get('.list-group-item').should('have.length', 2);
  });

  it('should remove recipes from favorites', () => {
    // Navigate to My Recipes
    cy.visit('/my-recipes');

    // Remove first recipe from favorites
    cy.get('.list-group-item').first().within(() => {
      cy.get('.favorite-btn').click();
    });

    // Verify recipe was removed from My Recipes
    cy.get('.list-group-item').should('have.length', 1);
  });

  it('should persist favorites after page reload', () => {
    // Navigate to My Recipes to check initial favorites
    cy.visit('/my-recipes');
    cy.get('.list-group-item').its('length').as('favoriteCount');

    // Reload page
    cy.reload();

    // Verify favorites count remains the same
    cy.get('.list-group-item').its('length').should('eq', '@favoriteCount');
  });
});
