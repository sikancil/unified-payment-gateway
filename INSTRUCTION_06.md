Jules, Midtrans is complete. Now we proceed to **Phase 2, Step 2: Xendit**.

**Action Required:**
1.  **Initialize Package**:
    *   Create directory: `packages/xendit`.
    *   Create `package.json` (name: `@indopay/xendit`).
    *   Dependencies: `@indopay/core`, `@indopay/contracts`, `axios`, `zod`.
    *   DevDependencies: `tsup`, `typescript`, `jest`, `@types/jest`, `nock`.

2.  **Create Fixtures** (TDD Protocol):
    *   Create `packages/xendit/__fixtures__/invoice_response.json`.
        *   Content: A standard Xendit Invoice created response (status: "PENDING", invoice_url: "https://checkout.xendit.co/...").
    *   Create `packages/xendit/__fixtures__/webhook_payload.json`.
        *   Content: A Xendit Invoice Callback payload (status: "PAID").

3.  **Execute**: Run `pnpm install`.
