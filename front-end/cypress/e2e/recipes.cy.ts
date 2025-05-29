describe('Recipe Functionality', () => {
  const testEmail = 'test@example.com';
  const testPassword = 'test123';

  beforeEach(() => {
    cy.login(testEmail, testPassword);
    cy.visit('/recipes');
  });

  it('should display recipe list', () => {
    cy.get('.list-group-item').should('exist');
  });

  it('should display recipe details when clicking a recipe', () => {
    cy.get('.list-group-item').first().click();
    cy.get('.btn-primary').should('contain', 'Manage Recipe');
    cy.get('img').should('be.visible');
    cy.get('h1').should('exist');
  });

  it('should allow creating a new recipe', () => {
    cy.contains('New Recipe').click();
    
    // Fill in recipe form
    cy.get('#name').type('Test Recipe');
    cy.get('#imagePath').type('https://example.com/image.jpg');
    cy.get('#description').type('Test Description');
    
    // Add an ingredient
    cy.get('button').contains('Add Ingredient').click();
    cy.get('input[formControlName="name"]').last().type('Test Ingredient');
    cy.get('input[formControlName="amount"]').last().type('2');
    
    // Save the recipe
    cy.get('button').contains('Save').click();
    
    // Verify we're redirected and recipe appears in list
    cy.url().should('include', '/recipes');
    cy.get('.list-group-item').should('contain', 'Test Recipe');
  });

  it('should allow editing a recipe', () => {
    cy.get('.list-group-item').first().click();
    cy.contains('Edit Recipe').click();
    
    // Edit name
    cy.get('#name').clear().type('Updated Recipe Name');
    
    // Save changes
    cy.get('button').contains('Save').click();
    
    // Verify changes
    cy.get('.list-group-item').should('contain', 'Updated Recipe Name');
  });

  it('should allow deleting a recipe', () => {
    cy.get('.list-group-item').first().click();
    cy.get('.dropdown-toggle').click();
    cy.contains('Delete Recipe').click();
    
    // Verify recipe is deleted
    cy.get('.list-group-item').should('not.contain', 'Updated Recipe Name');
  });
});
