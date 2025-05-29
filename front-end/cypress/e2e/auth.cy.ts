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

  describe('Unauthenticated Access Redirects', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should redirect to auth when trying to access My Recipes', () => {
      cy.visit('/my-recipes');
      cy.url().should('include', '/auth');
    });

    it('should redirect to auth when trying to access Recipe Ideas', () => {
      cy.visit('/recipe-ideas');
      cy.url().should('include', '/auth');
    });

    it('should redirect to auth when trying to access Seller Dashboard', () => {
      cy.visit('/seller');
      cy.url().should('include', '/auth');
    });

    it('should redirect to auth when clicking protected nav links', () => {
      // My Recipes link should not be visible but we can force visit
      cy.visit('/my-recipes');
      cy.url().should('include', '/auth');

      // Recipe Ideas link should not be visible but we can force visit
      cy.visit('/recipe-ideas');
      cy.url().should('include', '/auth');

      // Seller Dashboard link should not be visible but we can force visit
      cy.visit('/seller');
      cy.url().should('include', '/auth');
    });

    it('should preserve attempted URL and redirect after successful login', () => {
      // Try to access protected route
      cy.visit('/my-recipes');
      cy.url().should('include', '/auth');

      // Login
      cy.get('#email').type(testEmail);
      cy.get('#password').type(testPassword);
      cy.get('form').submit();

      // Should redirect to originally requested URL
      cy.url().should('include', '/my-recipes');
    });

    it('should show auth-only links after login', () => {
      // Verify auth-only links are not visible initially
      cy.get('.navbar-nav').should('not.contain', 'My Recipes');
      cy.get('.navbar-nav').should('not.contain', 'Recipe Ideas');
      cy.get('.navbar-nav').should('not.contain', 'Seller Dashboard');
      
      // Login
      cy.visit('/auth');
      cy.get('#email').type(testEmail);
      cy.get('#password').type(testPassword);
      cy.get('form').submit();

      // Verify auth-only links are now visible
      cy.get('.navbar-nav').should('contain', 'My Recipes');
      cy.get('.navbar-nav').should('contain', 'Recipe Ideas');
      cy.get('.navbar-nav').should('contain', 'Seller Dashboard');
    });

    it('should hide protected links when not authenticated', () => {
      cy.get('.navbar-nav').should('not.contain', 'My Recipes');
      cy.get('.navbar-nav').should('not.contain', 'Recipe Ideas');
      cy.get('.navbar-nav').should('not.contain', 'Seller Dashboard');
      cy.get('.navbar-nav').should('not.contain', 'Manage');
    });

    it('should hide protected links after logout', () => {
      // First login
      cy.visit('/auth');
      cy.get('#email').type(testEmail);
      cy.get('#password').type(testPassword);
      cy.get('form').submit();

      // Verify links are visible
      cy.get('.navbar-nav').should('contain', 'My Recipes');
      cy.get('.navbar-nav').should('contain', 'Recipe Ideas');
      cy.get('.navbar-nav').should('contain', 'Seller Dashboard');

      // Logout
      cy.contains('Logout').click();

      // Verify links are hidden again
      cy.get('.navbar-nav').should('not.contain', 'My Recipes');
      cy.get('.navbar-nav').should('not.contain', 'Recipe Ideas');
      cy.get('.navbar-nav').should('not.contain', 'Seller Dashboard');
      cy.get('.navbar-nav').should('not.contain', 'Manage');
    });
  });
});
