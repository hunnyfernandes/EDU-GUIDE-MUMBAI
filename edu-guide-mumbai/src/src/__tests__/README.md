# Frontend Tests

This directory contains tests for the React frontend.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Test Structure

- `__tests__/` - Test files
  - Component tests
  - Utility function tests
  - Integration tests

## Writing Tests

Tests should follow React Testing Library best practices:
- Test user behavior, not implementation details
- Use queries that are accessible to users
- Test components in isolation
- Mock API calls and external dependencies

## Example Test

```javascript
import { render, screen } from '@testing-library/react';
import Component from '../Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```











