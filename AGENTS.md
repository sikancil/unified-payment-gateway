# Agent Guidelines: IndoPay Unified Payment Standard

These guidelines are derived from the project's PRD and represent the core architectural principles of the `indopay-monorepo`. You (the agent) must adhere to these rules strictly when generating, refactoring, or reviewing code.

## 1. Architecture: Inversion of Control (IoC)
*   **No Direct Driver Dependencies:** The core logic and provider packages **must never** depend on specific infrastructure libraries (e.g., `typeorm`, `prisma`, `bullmq`, `winston`).
*   **The Bridge Pattern:** All interactions with the "outside world" (Persistence, Queues, Logging) must occur through interfaces defined in `packages/contracts`.
    *   **Persistence:** Use `ITransactionRepository` (injected).
    *   **Async Processing:** Use `IJobQueue` (injected).
    *   **Logging:** Use `ILogger` (injected).
*   **Host Responsibility:** The host application (e.g., NestJS, Express) is responsible for providing the concrete implementations of these contracts.

## 2. Monorepo Structure & Scope
*   **`packages/core`:** Contains base interfaces, custom errors, and shared utilities. No provider-specific logic here.
*   **`packages/contracts`:** Contains the definitions for the "Bridge" interfaces that the host app implements.
*   **`packages/{provider}`:** Isolated implementations for specific providers (e.g., `midtrans`, `xendit`). Each provider should be its own workspace.
*   **`packages/nestjs`:** A specific wrapper for NestJS integration.

## 3. Strict Typing & Normalization
*   **Standardization:** All inputs and outputs must be normalized.
    *   Input: `CreatePaymentInput`
    *   Output: `PaymentTransaction` with standardized enums (`PENDING`, `PAID`, `FAILED`).
*   **Webhooks:**
    *   Raw payloads must be transformed into `NormalizedWebhookEvent`.
    *   **Signature Verification:** Every webhook adapter must verify the signature (HMAC, etc.) **before** processing or normalization.

## 4. Security & Cryptography
*   **DBS RAPID:** Implement PGP encryption/decryption using `openpgp` for this specific provider.
*   **General:** Ensure all cryptographic operations are secure and adhere to provider specifications.

## 5. Coding Standards
*   **TypeScript:** While the initial setup might be JS, the goal is robust, typed interfaces (likely implied by "Strict Typing"). Ideally, we should move towards TS or robust JSDoc if staying in JS. *Note: PRD mentions "Base interfaces", implying Typescript or strong structural typing.*
*   **Error Handling:** Use custom error classes defined in `packages/core`.

## 6. Verification
*   Before marking a task as complete, verify that:
    *   No forbidden dependencies have crept into `packages/core` or provider packages.
    *   The IoC pattern is respected.
    *   Normalization is applied correctly.
