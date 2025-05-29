# Cypress Testing Setup for Recipe Book Application

## Prerequisites
- Node.js installed (v14 or higher)
- Angular project set up
- Running backend server at http://localhost:8080

## Installation

1. Install Cypress and its dependencies:
```bash
npm install cypress @cypress/schematic --save-dev
```

2. Configuration files:
- `cypress.config.ts` - Main Cypress configuration
- `cypress/support/commands.ts` - Custom commands including login
- `cypress/support/e2e.ts` - E2E test configuration

## Test Structure

```typescript
cypress/e2e/
├── app.cy.ts         # Basic navigation tests
├── auth.cy.ts        # Authentication tests
├── recipes.cy.ts     # Recipe management tests
└── shopping-list.cy.ts # Shopping list tests
```

## Running Tests

1. Open Cypress Test Runner:
```bash
npm run cypress:open
```

2. Run tests headlessly:
```bash
npm run cypress:run
```

## Test Accounts
- Test User: test@example.com / test123

## Custom Commands

### Login Command
```typescript
cy.login(email, password)
```
Example:
```typescript
cy.login('test@example.com', 'test123')
```

## Important Notes

1. .gitignore entries for Cypress:
```
/cypress/screenshots/
/cypress/videos/
/cypress/downloads/
```

2. Before running tests:
- Ensure backend server is running
- Start Angular application with `ng serve`
- Make sure test user exists in the backend

## Running Individual Test Suites

```bash
# Run specific test file
npm run cypress:run --spec "cypress/e2e/auth.cy.ts"

# Run all tests
npm run cypress:run
```
