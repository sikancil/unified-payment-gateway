# Product Requirement Document: IndoPay Unified Payment Standard

## 1. Executive Summary
IndoPay is a unified, framework-agnostic Payment Gateway abstraction layer for Node.js. It standardizes interactions with Indonesian payment providers (Aggregators and Banks) using an **Inversion of Control (IoC)** architecture. This allows host applications (NestJS, Express) to inject their own infrastructure (Database, Queue, Logger) while the library handles business logic, normalization, and protocol security.

## 2. Supported Providers
| Provider | Type | Protocol | Key Features |
| :--- | :--- | :--- | :--- |
| **Midtrans** | Aggregator | REST / JSON | Snap, Core API |
| **Xendit** | Aggregator | REST / JSON | Invoices, eWallet, Cards |
| **iPaymu** | Aggregator | REST / JSON | QRIS, VA |
| **Doku** | Aggregator | REST / XML & JSON | Legacy (Jokul) & Enterprise |
| **Faspay** | Aggregator | REST / XML | High-volume Debit/Credit |
| **DBS RAPID**| Direct Bank| **PGP Encrypted** JSON| Real-time transfers, Virtual Accounts |

## 3. Architecture & Standards

### 3.1 Monorepo Structure
We use **Turborepo** with **pnpm workspaces**.
*   `packages/core`: Base interfaces, errors, and utilities.
*   `packages/contracts`: The "Bridge" interfaces (Repo, Queue, Logger) that the Host App implements.
*   `packages/{provider}`: Isolated implementations (e.g., `midtrans`, `dbs`).
*   `packages/nestjs`: Dynamic Module wrapper for NestJS integration.

### 3.2 Inversion of Control (The Bridge)
The library **must not** depend on specific drivers (TypeORM, BullMQ, Winston).
*   **Data Persistence:** Handled via `ITransactionRepository` (injected).
*   **Async Processing:** Handled via `IJobQueue` (injected).
*   **Logging:** Handled via `ILogger` (injected).

### 3.3 Security & Cryptography
*   **DBS RAPID:** Must implement PGP encryption/decryption using `openpgp`.
*   **Webhooks:** All providers must implement a `WebhookAdapter` that verifies signatures (HMAC) before normalization.

### 3.4 Data Normalization
*   **Input:** `CreatePaymentInput` (Standardized).
*   **Output:** `PaymentTransaction` (Standardized Enum Statuses: PENDING, PAID, FAILED).
*   **Webhooks:** Raw payloads must be transformed into `NormalizedWebhookEvent` before processing.

## 4. Development Roadmap
1.  **Foundation:** Setup Core interfaces and Contract definitions.
2.  **Standard Aggregators:** Midtrans, Xendit, iPaymu.
3.  **Complex Aggregators:** Faspay (XML), Doku (Legacy).
4.  **Banking Layer:** DBS RAPID (PGP Security).
5.  **Framework Wrapper:** NestJS Module.
