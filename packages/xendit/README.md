# @indopay/xendit

Xendit Payment Gateway adapter for IndoPay.

## Installation

```bash
pnpm add @indopay/xendit @indopay/core
```

## Usage

```typescript
import { XenditGateway } from '@indopay/xendit';

const gateway = new XenditGateway('SECRET-KEY', 'CALLBACK-TOKEN');

// Use gateway.createPayment(...) as standard
```
