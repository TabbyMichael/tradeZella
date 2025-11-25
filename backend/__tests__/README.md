# Test Suite Documentation

This directory contains all the tests for the TradeZella backend. Tests are organized into three categories: unit, integration, and end-to-end (E2E).

## Test Organization

- `unit/` - Unit tests for individual components, models, and services
- `integration/` - API integration tests that test routes and middleware
- `e2e/` - End-to-end tests that simulate real user workflows

## Running Tests Individually

Due to database constraints and Jest's ES6 module compatibility issues, tests should be run individually or by category rather than all at once.

### Running Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run specific unit test files
npm test -- __tests__/unit/models/user.model.test.js
npm test -- __tests__/unit/services/auth.service.test.js
```

Note: Some unit tests may fail due to Jest ES6 module mocking incompatibility.

### Running Integration Tests

```bash
# Run all integration tests
npm run test:integration

# Run specific integration test files
npm test -- __tests__/integration/auth.integration.test.js
npm test -- __tests__/integration/forum.integration.test.js
npm test -- __tests__/integration/trades.integration.test.js
```

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific E2E test files
npm test -- __tests__/e2e/auth.e2e.test.js
```

### Running Tests with Database Isolation

To prevent database interference between tests, use the `--runInBand` flag:

```bash
# Run integration tests sequentially
npm test -- --testPathPattern=__tests__/integration --runInBand

# Run a specific test file with database isolation
npm test -- __tests__/integration/auth.integration.test.js --runInBand
```

## Test Categories

### Unit Tests
- Test individual functions and methods in isolation
- Located in `__tests__/unit/`
- Mock external dependencies

### Integration Tests
- Test API endpoints and database interactions
- Located in `__tests__/integration/`
- Use real database connections

### E2E Tests
- Simulate complete user workflows
- Located in `__tests__/e2e/`
- Test the entire application stack

## Common Test Commands

```bash
# Run tests and watch for changes
npm run test:watch -- __tests__/integration/auth.integration.test.js

# Run tests with coverage
npm run test:coverage -- --testPathPattern=__tests__/integration --runInBand

# Run tests in verbose mode
npm test -- --verbose --testPathPattern=__tests__/integration/auth.integration.test.js
```

## Troubleshooting

1. **Database Interference**: Use `--runInBand` flag to run tests sequentially
2. **ES6 Module Issues**: Some unit tests with mocking may fail due to Jest compatibility
3. **Authentication Failures**: Ensure test database is properly initialized
4. **Port Conflicts**: Make sure no other instances are running on the same ports