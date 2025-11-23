Jules, Phase 1 is complete. We now begin **Phase 2: Standard Aggregators**.
We will implement **Midtrans** first.

**Action Required:**
1.  **Initialize Package**:
    *   Create directory: `packages/midtrans`.
    *   Create `package.json` (name: `@indopay/midtrans`).
    *   Dependencies: `@indopay/core`, `@indopay/contracts`, `axios`.
    *   DevDependencies: `tsup`, `typescript`, `jest`, `@types/jest`, `nock` (for HTTP mocking).

2.  **Create Fixtures** (Crucial for TDD):
    *   Create `packages/midtrans/__fixtures__/charge_response_success.json`.
    *   Paste a real sample Midtrans Core API response (e.g., status_code: "201", transactionSKU: "SETTLEMENT").
    *   Create `packages/midtrans/__fixtures__/webhook_payload.json`.

3.  **Execute**: Run `pnpm install` to link the workspace.
