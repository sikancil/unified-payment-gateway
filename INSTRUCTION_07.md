Jules, implement the Xendit logic.

**Action Required:**
Create `packages/xendit/src/`:

1.  **`schemas.ts`**:
    *   Define Zod schemas for `XenditInvoiceRequest`, `XenditInvoiceResponse`, and `XenditWebhookPayload`.

2.  **`xendit.adapter.ts`**:
    *   Class `XenditGateway` implements `IPaymentGateway`.
    *   **Constructor**: Accept `secretKey` and `callbackToken`.
    *   **Method `createPayment`**:
        *   Map input to Xendit Invoice Payload.
        *   POST to `https://api.xendit.co/v2/invoices`.
        *   Auth: Basic Auth (username: `secretKey`, password: "").
        *   Return `PaymentTransaction` (action type: `URL`).
    *   **Method `verifySignature`**:
        *   Check if `headers['x-callback-token']` matches `this.callbackToken`.

3.  **`index.ts`**: Export the adapter.

4.  **`xendit.test.ts`**:
    *   Write Nock tests using the fixtures.
    *   Test `createPayment` (Invoice creation).
    *   Test `verifySignature` (Token check).
