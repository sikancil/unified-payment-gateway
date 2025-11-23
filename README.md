# IndoPay Monorepo

A unified, framework-agnostic Payment Gateway abstraction layer for Node.js, supporting multiple Indonesian payment providers.

## Features

*   **Unified Interface**: All providers implement `IPaymentGateway` from `@indopay/core`.
*   **Inversion of Control**: Implement your own storage and logging via `@indopay/contracts`.
*   **Framework Agnostic**: Use with Express, Fastify, or NestJS.
*   **NestJS Ready**: Includes `@indopay/nestjs` for easy integration.
*   **Strict Typing**: Built with TypeScript and strict configuration.
*   **Secure**: Handles encryption (PGP for DBS), signatures (HMAC, SHA), and XML parsing automatically.

## Supported Providers

| Package | Provider | Features |
| :--- | :--- | :--- |
| `@indopay/midtrans` | Midtrans | Core API, Snap, Notification Handling |
| `@indopay/xendit` | Xendit | Invoices, Callback Token Verification |
| `@indopay/faspay` | Faspay | XML-based Debit/Credit, Signature Handling |
| `@indopay/dbs` | DBS RAPID | PGP Encryption/Decryption |
| `@indopay/doku` | Doku (Jokul) | Digest & HMAC Signature Authentication |
| `@indopay/ipaymu` | iPaymu | V2 API, HMAC-SHA256 |

## Installation

```bash
# Core is required
pnpm add @indopay/core @indopay/contracts

# Add specific provider
pnpm add @indopay/midtrans
```

## Usage Example (Vanilla TS/Node)

```typescript
import { MidtransGateway } from '@indopay/midtrans';
import { CreatePaymentInput, PaymentMethodType } from '@indopay/core';

const gateway = new MidtransGateway('SERVER-KEY-...', false); // false = Sandbox

const input: CreatePaymentInput = {
  amount: 10000,
  currency: 'IDR',
  referenceId: 'ORDER-001',
  paymentMethod: PaymentMethodType.CREDIT_CARD,
  customer: {
    email: 'customer@example.com',
    firstName: 'John',
    lastName: 'Doe'
  }
};

gateway.createPayment(input).then(transaction => {
  console.log('Transaction Created:', transaction);
});
```

## Usage Example (NestJS)

```typescript
import { Module } from '@nestjs/common';
import { IndopayModule } from '@indopay/nestjs';
import { MidtransGateway } from '@indopay/midtrans';

@Module({
  imports: [
    IndopayModule.forRoot({
      providers: [
        {
          name: 'midtrans',
          useFactory: () => new MidtransGateway('SERVER-KEY', false),
        },
      ],
      defaultProvider: 'midtrans',
    }),
  ],
})
export class AppModule {}
```

## Development

1.  **Install**: `pnpm install`
2.  **Build**: `pnpm build`
3.  **Test**: `pnpm test`
4.  **Playground**: `pnpm --filter @indopay/playground dev`
