Jules, the library is complete. Now we must verify the architecture in `apps/playground`.

**Action Required:**
1.  **Install Dependencies**:
    *   In `apps/playground`: Add `@indopay/core`, `@indopay/contracts`, `@indopay/midtrans`.

2.  **Implement Infrastructure (The Bridge)**:
    *   Create `apps/playground/src/infra/memory-repo.ts`: Implement `ITransactionRepository` using a simple `Map<string, any>`.
    *   Create `apps/playground/src/infra/console-logger.ts`: Implement `ILogger`.

3.  **Create Simulation Script**:
    *   Update `apps/playground/src/index.ts`:
        *   Initialize `MidtransGateway` (use Sandbox keys).
        *   Initialize `MemoryTransactionRepository`.
        *   **Simulation Flow**:
            1. Create a `CreatePaymentInput`.
            2. Call `gateway.createPayment()`.
            3. Log the result.
            4. Save the result to `repo.create()`.
            5. Fetch it back via `repo.findByReference()`.
            6. Log "Success".

4.  **Execute**: Run `pnpm install` and then `pnpm --filter @indopay/playground dev` to test.
