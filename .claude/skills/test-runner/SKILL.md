---
name: test-runner
description: Runs the Stocky unit test suite (Vitest) from StockyApp/. Use when the user asks to run tests, check if tests pass, or verify changes with the test suite.
---

# Test Runner

Runs the project's unit tests using Vitest.

## Steps

1. Run the test suite from the `StockyApp/` directory:
   ```sh
   cd StockyApp && npm run test
   ```
2. Report results:
   - If all tests pass, summarize the pass count briefly.
   - If any tests fail, show the failing test names and error output, then investigate and fix the underlying issue (not the test, unless the test itself is wrong).
3. Re-run `npm run test` after making fixes to confirm they pass.

## Notes

- Tests run via `vitest run` (single run, not watch mode) as defined in `StockyApp/package.json`.
- There is no separate lint script configured for this project.
