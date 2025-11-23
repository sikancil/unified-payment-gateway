Jules, implement the Faspay logic handling XML transformation.

**Action Required:**
Create `packages/faspay/src/`:

1.  **`utils.ts`**:
    *   Implement `signature(userId, password, orderId)` using MD5/SHA1 as per Faspay spec.
    *   Implement `parseXml(string)` using `fast-xml-parser`.

2.  **`faspay.adapter.ts`**:
    *   Class `FaspayGateway` implements `IPaymentGateway`.
    *   **Constructor**: Accept `merchantId`, `merchantName`, `userId`, `password`.
    *   **Method `createPayment`**:
        *   Map input to Faspay XML/Form Data.
        *   POST to `https://web.faspay.co.id/cvr/300011/10`.
        *   Parse XML Response -> `PaymentTransaction`.
    *   **Method `processWebhook`**:
        *   Parse XML payload.
        *   Verify signature.
        *   Normalize status (`payment_status_code: '2'` -> `PAID`).

3.  **`faspay.test.ts`**:
    *   Use `nock` to mock XML responses.
    *   Assert that XML parsing works and returns a clean JSON object.
