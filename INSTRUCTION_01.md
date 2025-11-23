Jules, I have analyzed the current repository state. While the structure is correct, `packages/core` is missing critical dependencies and configuration required by `AGENTS.md`.

**Action Required:**
1.  **Update `packages/core/package.json`**:
    *   Add `zod` as a dependency (Required for runtime validation).
    *   Add `tsup` as a devDependency (Required for dual CJS/ESM builds).
    *   Update the `build` script to: `"build": "tsup src/index.ts --format cjs,esm --dts"`.
    *   Update `main`: `"./dist/index.js"`, `module`: `"./dist/index.mjs"`, `types`: `"./dist/index.d.ts"`.

2.  **Update `packages/contracts/package.json`**:
    *   Apply the same `tsup` configuration and build scripts as `core`.
    *   Note: `contracts` does not need `zod`.

3.  **Execute**: Run `pnpm install` in the root to ensure lockfiles are updated.
