Jules, now we implement the logic for `packages/core`. Refer to `PRD.md` section 4.1.

**Action Required:**
Create the following files in `packages/core/src/`:

1.  **`types.ts`**:
    *   Define Enums: `PaymentMethodType`, `PaymentStatus`.
    *   Define Interfaces: `CustomerDetails`, `CreatePaymentInput`, `PaymentTransaction`.
    *   *Strictness:* Ensure `metadata` is `Record<string, unknown>` (not `any`).

2.  **`errors.ts`**:
    *   Implement `IndoPayError` (Base class).
    *   Implement specific errors: `ValidationError`, `PaymentProviderException`, `AuthenticationException`, `SignatureVerificationException`.

3.  **`interfaces.ts`**:
    *   Define `IPaymentGateway` interface.
    *   It must use the types from `types.ts`.

4.  **`index.ts`**:
    *   Export everything from these three files.
