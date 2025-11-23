Jules, now implement the Midtrans logic. You must satisfy `IPaymentGateway` from `@indopay/core`.

**Action Required:**
Create `packages/midtrans/src/`:

1.  **`midtrans.adapter.ts`**:
    *   Class `MidtransGateway` implements `IPaymentGateway`.
    *   **Constructor**: Accept `serverKey` and `isProduction` flags.
    *   **Method `createPayment`**:
        *   Map `CreatePaymentInput` -> Midtrans JSON payload.
        *   POST to `https://api.sandbox.midtrans.com/v2/charge`.
        *   Map Response -> `PaymentTransaction` (Normalize `settlement` -> `PaymentStatus.PAID`).
    *   **Method `verifySignature`**: Implement SHA512(orderId + status + amount + key).

2.  **`index.ts`**: Export the adapter.

3.  **`midtrans.test.ts`**:
    *   Use `nock` to intercept the API call.
    *   Return the fixture data.
    *   Assert that `createPayment` returns a correct `PaymentTransaction` object.
