Jules, final polish.

**Action Required:**
1.  **License**:
    *   Write/Update `LICENSE` file in the root (MIT License).

2.  **Package Metadata**:
    *   Update every `package.json` in `packages/*`:
        *   Add `"author": "IndoPay Team"`.
        *   Add `"repository": { "type": "git", "url": "..." }`.
        *   Add `"license": "MIT"`.
        *   Ensure `"sideEffects": false` is set for tree-shaking.

3.  **Playground CI Check**:
    *   Add a script `pnpm test:e2e` in root that runs the playground simulation.
    *   Update `apps/playground/src/index.ts` to exit with code 0 on success and 1 on failure, so it can be used as a CI verify step.
