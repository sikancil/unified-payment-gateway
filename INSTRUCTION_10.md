Jules, Faspay is complete. We now proceed to **Phase 4: Banking Layer (DBS RAPID)**.
This requires PGP encryption.

**Action Required:**
1.  **Initialize Package**:
    *   Create directory: `packages/dbs`.
    *   Create `package.json` (name: `@indopay/dbs`).
    *   Dependencies: `@indopay/core`, `@indopay/contracts`, `axios`, `zod`, `openpgp`.
    *   DevDependencies: `tsup`, `typescript`, `jest`, `@types/jest`, `nock`.

2.  **Create Key Fixtures** (Crucial for TDD):
    *   Create `packages/dbs/__fixtures__/keys.ts`.
    *   Export `TEST_PRIVATE_KEY` and `TEST_PUBLIC_KEY` (Generate a real PGP key pair for testing purposes and hardcode it here. Do NOT use placeholders, use a valid generated RSA 2048 block).

3.  **Create Payload Fixtures**:
    *   Create `packages/dbs/__fixtures__/payment_response.json` (The decrypted JSON).
    *   Create `packages/dbs/__fixtures__/payment_encrypted.txt` (An example encrypted block).

4.  **Execute**: Run `pnpm install`.
