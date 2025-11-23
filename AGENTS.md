# AGENT GUIDELINES: IndoPay Unified Payment Standard

This document is the **Law** for this repository. It merges architectural strictness with implementation precision. You must adhere to these rules without exception.

## 1. The Core Philosophy: Inversion of Control (IoC)
*   **The "Bridge" Pattern:** This library is a "Headless Engine".
    *   **Core Logic:** Resides in `packages/core` and `packages/{provider}`.
    *   **Infrastructure:** Resides in the Host App, NOT here.
*   **Strict Forbidden Dependencies:**
    *   ❌ NEVER import `typeorm`, `prisma`, `mongoose`, `sequelize`, `pg`, `mysql`.
    *   ❌ NEVER import `bull`, `bullmq`, `kafkajs`, `amqplib`.
    *   ❌ NEVER import `winston`, `pino` (directly).
*   **The Interface Rule:** All external side-effects (Database, Queue, Logging) MUST use the interfaces defined in `packages/contracts`.

## 2. Monorepo Structure
*   **`packages/core`**: The Brain. Base types, standard Enums (`PaymentStatus`), and `IndoPayError` classes.
*   **`packages/contracts`**: The Bridge. Interfaces that the user MUST implement (`ITransactionRepository`, `IJobQueue`).
*   **`packages/{provider}`**: The Limbs. Isolated implementations (e.g., `midtrans`, `dbs`).
*   **`apps/playground`**: The Lab. An Express/Node app where we import "forbidden" libraries to test the Bridge.

## 3. Strict Engineering Standards (The "How")
*   **Language:** **TypeScript Only**. `strict: true`. No `.js` files allowed in packages.
*   **No `any`:** usage of `any` is strictly forbidden. Use `unknown` + Type Guards (Zod).
*   **Runtime Validation:** You MUST use **Zod** to validate all incoming data from Payment Providers. Never trust an API response matches its documentation blindly.
*   **Error Handling:**
    *   ❌ `throw new Error("Failed")`
    *   ✅ `throw new PaymentProviderException("Insufficient funds", "DBS_001")`

## 4. Test-Driven Development (TDD) Protocol
You are required to work in this order:
1.  **Create Fixtures:** Create `packages/{provider}/__fixtures__/{scenario}.json` (or `.xml`, `.txt`).
2.  **Write the Test:** Write a Jest test that attempts to mock the API call and assert the output matches `PaymentTransaction`.
3.  **Write the Code:** Implement the logic to pass the test.

## 5. Security & Provider Specifics
*   **DBS RAPID:**
    *   REQUIRES `openpgp` for payload encryption/decryption.
    *   Input payload is JSON -> Encrypt -> Send.
    *   Response payload is Encrypted String -> Decrypt -> JSON.
*   **Faspay & Doku:**
    *   REQUIRES `fast-xml-parser`.
    *   Must normalize XML structures into the standard JSON format.
*   **Webhooks:**
    *   **Verification First:** You must verify the HMAC/Signature BEFORE parsing the body.

## 6. Verification Checklist
Before finishing a response/task:
1.  [ ] Did I use `Zod` to validate external data?
2.  [ ] Did I respect the `ITransactionRepository` interface instead of writing SQL?
3.  [ ] Is there a Jest test covering this logic?
4.  [ ] Are all Enums normalized (e.g., `provider_status: 'SETTLEMENT'` -> `PaymentStatus.PAID`)?
