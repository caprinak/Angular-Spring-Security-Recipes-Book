describe('Authentication', () => {
  const testEmail = 'test@example.com';
  const testPassword = 'test123';

  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate to auth page when clicking authenticate', () => {
    cy.contains('Authenticate').click();
    cy.url().should('include', '/auth');
  });

  it('should successfully login with valid credentials', () => {
    cy.visit('/auth');
    cy.get('#email').type(testEmail);
    cy.get('#password').type(testPassword);
    cy.get('form').submit();
    
    // Verify successful login
    cy.url().should('not.include', '/auth');
    cy.get('.navbar-nav').should('contain', 'Logout');
    cy.get('.navbar-nav').should('contain', 'My Recipes');
    cy.get('.navbar-nav').should('contain', 'Manage');
  });

  it('should show error message with invalid credentials', () => {
    cy.visit('/auth');
    cy.get('#email').type('wrong@example.com');
    cy.get('#password').type('wrongpass');
    cy.get('form').submit();
    
    cy.get('.alert-danger').should('be.visible');
  });

  it('should successfully logout', () => {
    // First login
    //cy.login(testEmail, testPassword);
    
    // Then logout
    cy.contains('Logout').click();
    
    // Verify logout
    cy.get('.navbar-nav').should('contain', 'Authenticate');
    cy.get('.navbar-nav').should('not.contain', 'Logout');
    cy.get('.navbar-nav').should('not.contain', 'My Recipes');
  });

  it('should switch between login and signup modes', () => {
    cy.visit('/auth');
    
    // Check initial state
    cy.contains('button', 'Login').should('exist');
    cy.contains('button', 'Switch to Sign Up').should('exist');
    
    // Switch to signup
    cy.contains('Switch to Sign Up').click();
    cy.contains('button', 'Sign Up').should('exist');
    cy.contains('button', 'Switch to Login').should('exist');
    
    // Switch back to login
    cy.contains('Switch to Login').click();
    cy.contains('button', 'Login').should('exist');
  });
});
