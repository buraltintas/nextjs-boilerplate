# Testing Guide

This project uses **Jest** and **React Testing Library** for unit and integration testing.

## 🧪 Testing Stack

- **Jest 30.2.0** - Test runner and assertion library
- **React Testing Library 16.3.2** - React component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers for DOM
- **@testing-library/user-event** - User interaction simulation

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## 📁 Test Organization

Tests are co-located with the code they test in `__tests__` directories:

```
src/
├── shared/
│   └── utils/
│       ├── index.ts
│       └── __tests__/
│           └── utils.test.ts
├── features/
│   └── auth/
│       ├── components/
│       │   ├── login-form.tsx
│       │   └── __tests__/
│       │       └── login-form.test.tsx
```

## ✍️ Writing Tests

### Example: Testing Utility Functions

```typescript
// src/shared/utils/__tests__/utils.test.ts
import { capitalize, isEmpty } from '../index';

describe('Utility Functions', () => {
  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });
  });

  describe('isEmpty', () => {
    it('returns true for empty string', () => {
      expect(isEmpty('')).toBe(true);
    });

    it('returns false for non-empty string', () => {
      expect(isEmpty('hello')).toBe(false);
    });
  });
});
```

### Example: Testing React Components

```typescript
// src/shared/components/__tests__/button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Example: Testing Custom Hooks

```typescript
// src/shared/hooks/__tests__/use-debounce.test.ts
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../use-debounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('test');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Initial value
    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial'); // Still initial

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated'); // Now updated
  });
});
```

## 🎯 Best Practices

### 1. Test User Behavior, Not Implementation

❌ **Bad:**
```typescript
it('updates state when setValue is called', () => {
  const { result } = renderHook(() => useState(0));
  result.current[1](5);
  expect(result.current[0]).toBe(5);
});
```

✅ **Good:**
```typescript
it('increments counter when button is clicked', async () => {
  const user = userEvent.setup();
  render(<Counter />);
  
  await user.click(screen.getByRole('button', { name: /increment/i }));
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 2. Use Semantic Queries

Prefer queries in this order:
1. `getByRole` - Best for accessibility
2. `getByLabelText` - Good for form elements
3. `getByPlaceholderText` - For inputs without labels
4. `getByText` - For non-interactive elements
5. `getByTestId` - Last resort

### 3. Use `userEvent` Instead of `fireEvent`

❌ **Bad:**
```typescript
fireEvent.click(button);
```

✅ **Good:**
```typescript
const user = userEvent.setup();
await user.click(button);
```

### 4. Mock External Dependencies

```typescript
// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'test' }),
  })
) as jest.Mock;

// Mock modules
jest.mock('@/bff', () => ({
  api: {
    users: {
      getAll: jest.fn(() => Promise.resolve({ data: [] })),
    },
  },
}));
```

### 5. Test Async Code Properly

```typescript
it('loads and displays data', async () => {
  render(<UserList />);
  
  // Wait for loading to finish
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  // Wait for data to appear
  const users = await screen.findByText(/john doe/i);
  expect(users).toBeInTheDocument();
});
```

## 📊 Coverage

View coverage report after running:

```bash
npm run test:coverage
```

Coverage reports are generated in `coverage/` directory.

### Coverage Thresholds

We aim for:
- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

## 🔧 Configuration

### jest.config.js

The Jest configuration includes:
- Path aliases (`@/app`, `@/bff`, etc.)
- JSDOM environment for React
- Coverage collection settings
- Transform ignore patterns for node_modules

### jest.setup.ts

Setup file includes:
- `@testing-library/jest-dom` matchers
- `window.matchMedia` mock
- `IntersectionObserver` mock
- Console error suppression for known warnings

## 🚫 What NOT to Test

- Third-party libraries (already tested)
- Next.js internals
- Implementation details
- Styles and CSS (use visual regression testing instead)
- External API responses (use mocks)

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest Matchers](https://jestjs.io/docs/expect)

---

**Happy Testing!** 🎉
