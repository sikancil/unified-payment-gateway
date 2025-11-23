Jules, implement the Doku (Jokul) logic.

**Action Required:**
Create `packages/doku/src/`:

1.  **`utils.ts`**:
    *   Implement `generateDigest(body: string): string` (SHA256 Base64).
    *   Implement `generateSignature(clientId, requestId, timestamp, requestTarget, digest, secretKey)`: HMAC-SHA256.
    *   Format: `Client-Id: ...\nRequest-Id: ...\n...`.

2.  **`doku.adapter.ts`**:
    *   Class `DokuGateway` implements `IPaymentGateway`.
    *   **Constructor**: Accept `clientId`, `secretKey`.
    *   **Method `createPayment`**:
        *   Map input to Doku Checkout API (Jokul).
        *   Generate `Digest` and `Signature` headers.
        *   POST to `https://api-sandbox.doku.com/checkout/v1/payment`.
        *   Map response to `PaymentTransaction`.

3.  **`doku.test.ts`**:
    *   Mock the API.
    *   Verify that the headers sent to Nock contain the correct `Signature` format.
