Jules, implement the DBS RAPID logic handling PGP Encryption.

**Action Required:**
Create `packages/dbs/src/`:

1.  **`security.ts`**:
    *   Implement `encryptPayload(data: object, publicKey: string): Promise<string>`.
    *   Implement `decryptPayload(encryptedData: string, privateKey: string): Promise<object>`.
    *   Use `openpgp.readKey`, `openpgp.encrypt`, `openpgp.decrypt`.

2.  **`dbs.adapter.ts`**:
    *   Class `DbsGateway` implements `IPaymentGateway`.
    *   **Constructor**: Accept `clientId`, `privateKey`, `bankPublicKey`.
    *   **Method `createPayment`**:
        *   Map input to DBS JSON.
        *   **Encrypt** the JSON payload using `security.ts`.
        *   POST to `https://ideal.dbs.com/...`.
        *   **Decrypt** the response.
        *   Map to `PaymentTransaction`.

3.  **`dbs.test.ts`**:
    *   Use `keys.ts` fixtures.
    *   Mock the network call.
    *   Test that the payload sent to Nock IS encrypted (verify it's not plain JSON).
