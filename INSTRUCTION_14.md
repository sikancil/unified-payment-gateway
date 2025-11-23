Jules, Doku is complete. Now complete the final provider: **iPaymu**.

**Action Required:**
1.  **Initialize Package**:
    *   Create `packages/ipaymu` (`@indopay/ipaymu`).
    *   Dependencies: `@indopay/core`, `axios`, `zod`, `crypto-js` (or node crypto).

2.  **Fixtures**:
    *   Create `packages/ipaymu/__fixtures__/payment_response.json` (Standard iPaymu JSON).

3.  **Implementation**:
    *   Create `packages/ipaymu/src/ipaymu.adapter.ts`.
    *   **Signature**: iPaymu v2 signature is usually `HMAC-SHA256(stringToSign, secretKey)`.
    *   **String to Sign**: `POST:{va}:{requestBody}:{secret}` (Follow standard iPaymu V2 API spec logic).
    *   **Endpoint**: `https://my.ipaymu.com/api/v2/payment/direct`.
    *   Map `CreatePaymentInput` -> iPaymu Payload (`product[]`, `qty[]`, `price[]`).

4.  **Tests**:
    *   Write `ipaymu.test.ts` using Nock.
