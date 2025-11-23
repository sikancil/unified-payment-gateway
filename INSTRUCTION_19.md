Jules, final polish for Type Safety and CI.

**Action Required:**
1.  **Strict Contracts**:
    *   Update `packages/contracts/package.json`: Add `@indopay/core` as a dependency.
    *   Update `packages/contracts/src/repository.ts`:
        *   Import `PaymentTransaction` from `@indopay/core`.
        *   Change `create(data: Record<string, unknown>)` to `create(data: PaymentTransaction)`.
        *   Change `findByReference` return type to `Promise<PaymentTransaction | null>`.

2.  **CI Workflow**:
    *   Create `.github/workflows/ci.yml`.
    *   Steps: Checkout -> Install (pnpm) -> Build (Turbo) -> Test (Jest).

3.  **Final Verification**:
    *   Run `pnpm build` again to ensure the contract changes don't break the playground (update playground if needed).
