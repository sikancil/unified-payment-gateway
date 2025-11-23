Jules, DBS is complete. We now return to **Phase 3** to finish the remaining Aggregators.
Next target: **Doku (Jokul API)**.

**Action Required:**
1.  **Initialize Package**:
    *   Create directory: `packages/doku`.
    *   Create `package.json` (name: `@indopay/doku`).
    *   Dependencies: `@indopay/core`, `@indopay/contracts`, `axios`, `zod`.
    *   DevDependencies: `tsup`, `typescript`, `jest`, `@types/jest`, `nock`.

2.  **Create Fixtures** (TDD):
    *   Create `packages/doku/__fixtures__/payment_response.json`.
        *   Content: Standard Doku Jokul VA response (contains `order.invoice_number`, `virtual_account_info.virtual_account_number`).
    *   Create `packages/doku/__fixtures__/webhook_payload.json`.

3.  **Execute**: Run `pnpm install`.
