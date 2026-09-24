---
name: test-writer
description: Writes Vitest unit tests for Stocky code (utils, composables, and other testable modules). Use when the user asks to write tests, add test coverage, or create a test file for existing code.
---

# Test Writer

Writes unit tests for `StockyApp/` source files using Vitest, matching the project's existing test conventions.

## Steps

1. Identify the target file(s) to test (e.g. a file in `src/utils/`, `src/composables/`, or `src/services/`). Read the file fully to understand its exported functions/composables, branches, and edge cases.
2. Check whether a test file already exists alongside it (`<name>.test.js`). If it does, extend it rather than creating a duplicate; if not, create one at `src/<same-folder>/<name>.test.js`.
3. Look at an existing sibling test file (e.g. `src/utils/calorie.test.js` or `src/composables/useAuth.test.js`) to match style:
   - `import { describe, expect, it } from 'vitest'`
   - Group tests per exported function with `describe`, one `it` per behavior/branch.
   - Use `vi.fn()` / `vi.mock()` for composables that depend on Firebase services — never hit real Firebase. Mock the `services/` layer, not the SDK directly.
   - For composables using Vue reactivity, test via their returned refs/computed values directly (no component mounting needed unless the composable requires a component context).
4. Cover: the happy path, each conditional branch, boundary/edge cases (empty input, zero, negative, unknown enum values), and any error-throwing paths.
5. Run the new/updated tests to confirm they pass:
   ```sh
   cd StockyApp && npm run test
   ```
   If a test fails because of a real bug in the source, flag it to the user rather than silently changing the test to match broken behavior.
6. Run `npm run format` on the touched files before finishing.

## Notes

- Tests run via `vitest run` (single run, not watch mode).
- Don't test implementation details (internal variable names, private helpers) — test observable behavior through the module's exports.
- Keep one assertion focus per `it` block; prefer several small, clearly named tests over one large one.
