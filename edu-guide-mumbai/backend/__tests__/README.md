# Backend Tests

This directory contains tests for the backend API.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

- `__tests__/` - Test files
  - `setup.js` - Jest setup and configuration
  - `utils/` - Utility function tests
  - `middleware/` - Middleware tests
  - `controllers/` - Controller tests (to be added)
  - `services/` - Service tests (to be added)

## Writing Tests

Tests should follow the pattern:
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies (database, email service, etc.)
- Use async/await for asynchronous operations

## Example Test

```javascript
describe('Feature Name', () => {
  it('should do something correctly', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```











