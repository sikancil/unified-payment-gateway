Jules, Xendit is complete. We now proceed to **Phase 3: Complex Aggregators**, starting with **Faspay**.

**Action Required:**
1.  **Initialize Package**:
    *   Create directory: `packages/faspay`.
    *   Create `package.json` (name: `@indopay/faspay`).
    *   Dependencies: `@indopay/core`, `@indopay/contracts`, `axios`, `zod`, `fast-xml-parser`.
    *   DevDependencies: `tsup`, `typescript`, `jest`, `@types/jest`, `nock`.

2.  **Create XML Fixtures** (Crucial):
    *   Create `packages/faspay/__fixtures__/payment_response.xml`.
        *   Content: A standard Faspay XML response (e.g., `<faspay><response>Success</response><trx_id>...</trx_id></faspay>`).
    *   Create `packages/faspay/__fixtures__/payment_notification.xml` (Webhook).

3.  **Execute**: Run `pnpm install`.
