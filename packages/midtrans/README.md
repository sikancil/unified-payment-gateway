# @indopay/midtrans

Midtrans Payment Gateway adapter for IndoPay.

## Installation

```bash
pnpm add @indopay/midtrans @indopay/core
```

## Usage

```typescript
import { MidtransGateway } from '@indopay/midtrans';
import { CreatePaymentInput, PaymentMethodType } from '@indopay/core';

const gateway = new MidtransGateway('SERVER-KEY', false); // false for Sandbox

// Create Payment
const input: CreatePaymentInput = {
  amount: 10000,
  currency: 'IDR',
  referenceId: 'ORDER-001',
  paymentMethod: PaymentMethodType.CREDIT_CARD,
  customer: {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe'
  }
};

const transaction = await gateway.createPayment(input);
console.log(transaction);

// Handle Webhook
const webhookPayload = { ... }; // From Request Body
const verifiedTransaction = await gateway.processWebhook(webhookPayload);
```
