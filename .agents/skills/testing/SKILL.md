---
name: project_testing_standards
description: Instructions for writing and maintaining Vitest unit tests in the Beyanhane codebase.
---

# Beyanhane Testing Standards

This document provides a comprehensive guide for AI agents and contributors on how to write, maintain, and structure tests within the Beyanhane repository.

## 🛠 Tooling & Framework
- **Framework**: [Vitest](https://vitest.dev/)
- **Test Runner**: `npm test` (per package) or `npm run test:watch`
- **Environment**: Node.js (Crypto APIs are provided by standard Node/Vitest globals)

## 📂 Directory Structure
Tests must be placed within the `src/__test__/` directory of each package.

```text
packages/<package-name>/
├── src/
│   ├── modules/
│   │   └── logic.ts
│   └── __test__/                <-- All tests go here
│       ├── helpers/
│       │   └── fixtures.ts      <-- Shared test data/mocks
│       ├── logic.test.ts        <-- Unit tests
│       └── integration.test.ts
└── vitest.config.ts             <-- Per-package config
```

## 🧪 Testing Patterns

### 1. Fixtures & Mock Data
Never hardcode sensitive values or repetitive mock objects inside test files. Use `src/__test__/helpers/fixtures.ts`.

- **Secrets**: Must be at least 32 characters long to pass `ConfigurationError` checks.
- **JSON Objects**: Use `mockUser`, `mockSession`, etc., to keep tests clean.

### 2. Naming Conventions
- **Files**: `*.test.ts`
- **Descriptions**: Use clear, concise **English** for `describe` and `it` blocks.
- **Messages**: All default error messages and descriptive strings must be in **English**.

### 3. Testing Errors
Always test for both successful paths and failure cases.
- Use `toBeInstanceOf` for custom error classes (e.g., `InvalidTokenError`).
- Use `.rejects.toThrow()` for async failures.

```typescript
// Example: Testing for custom errors
await expect(verifyToken(token, wrongSecret)).rejects.toBeInstanceOf(InvalidTokenError)
```

### 4. Time Manipulation
For testing token or session expirations, use Vitest's fake timers.

```typescript
vi.useFakeTimers()
vi.advanceTimersByTime(2000) // Fast forward 2 seconds
// ... run expectations ...
vi.useRealTimers()
```

### 5. Crypto Considerations
- Our crypto implementation uses `AES-GCM` and requires standard `crypto.subtle` or Node `crypto` globals.
- Ensure `vitest.config.ts` handles the environment correctly (usually `node` environment).

## 🚀 How to Run Tests
1. **Interactive/Watch mode**: `npm run test:watch` (inside the package directory)
2. **CI/Single run**: `npm test`
3. **Coverage**: `npm run test:coverage` (outputs to `coverage/` directory)

## 📝 Best Practices
- **Isolation**: Each test should be independent. Use `beforeEach` to reset state if necessary.
- **Coverage**: Exclude re-export files (`index.ts`) from coverage reports in `vitest.config.ts`.
- **Symmetry**: For crypto/encode-decode logic, always verify round-trip success (encode -> decode -> original).
- **No Turkish**: Ensure no Turkish characters or text remains in test descriptions or expected values.
