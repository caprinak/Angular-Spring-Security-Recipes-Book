describe('Shopping List Functionality', () => {
  const testEmail = 'test@example.com';
  const testPassword = 'test123';

  beforeEach(() => {
    //cy.login(testEmail, testPassword);
    cy.visit('/shopping-list');
  });

  it('should add new ingredient to shopping list', () => {
    const ingredientName = 'Test Ingredient';
    const amount = '2';

    cy.get('#name').type(ingredientName);
    cy.get('#amount').type(amount);
    cy.contains('Add').click();

    cy.get('.list-group-item').should('contain', ingredientName);
    cy.get('.list-group-item').should('contain', amount);
  });

  it('should edit existing ingredient', () => {
    // First add an ingredient
    cy.get('#name').type('Original Ingredient');
    cy.get('#amount').type('1');
    cy.contains('Add').click();

    // Click on the ingredient to edit
    cy.get('.list-group-item').first().click();

    // Edit the ingredient
    cy.get('#name').should('have.value', 'Original Ingredient');
    cy.get('#name').clear().type('Updated Ingredient');
    cy.get('#amount').clear().type('3');
    cy.contains('Update').click();

    // Verify changes
    cy.get('.list-group-item').should('contain', 'Updated Ingredient');
    cy.get('.list-group-item').should('contain', '3');
  });

  it('should delete ingredient', () => {
    // First add an ingredient
    cy.get('#name').type('Ingredient to Delete');
    cy.get('#amount').type('1');
    cy.contains('Add').click();

    // Click on the ingredient to select it
    cy.get('.list-group-item').first().click();

    // Delete the ingredient
    cy.contains('Delete').click();

    // Verify ingredient is deleted
    cy.get('.list-group-item').should('not.contain', 'Ingredient to Delete');
  });

  it('should clear the form', () => {
    // Type something in the form
    cy.get('#name').type('Test');
    cy.get('#amount').type('1');

    // Clear the form
    cy.contains('Clear').click();

    // Verify form is cleared
    cy.get('#name').should('have.value', '');
    cy.get('#amount').should('have.value', '');
  });

  it('should validate form inputs', () => {
    // Try to submit empty form
    cy.contains('Add').should('be.disabled');

    // Try invalid amount
    cy.get('#name').type('Test');
    cy.get('#amount').type('0');
    cy.contains('Add').should('be.disabled');

    // Valid inputs
    cy.get('#amount').clear().type('1');
    cy.contains('Add').should('be.enabled');
  });
});
