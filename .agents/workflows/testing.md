---
description: How to run, maintain, and expand tests in the Beyanhane codebase.
---

1. Navigate to the package directory where you want to run or add tests (e.g., `packages/core`).
2. If adding new tests:
   - Create or update files in `src/__test__/`.
   - Use `src/__test__/helpers/fixtures.ts` for shared mock data.
   - Follow the `project_testing_standards` skill for naming and coding patterns.
// turbo
3. Run the tests to verify changes:
   `npm test`
4. If you need continuous feedback, run the watch mode:
   `npm run test:watch`
5. Check coverage to ensure the new code is fully tested:
   `npm run test:coverage`
6. Before committing, ensure all tests pass and follow the defined English naming conventions.
