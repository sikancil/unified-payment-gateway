# @indopay/faspay

Faspay Payment Gateway adapter for IndoPay with XML support.

## Installation

```bash
pnpm add @indopay/faspay @indopay/core
```

## Usage

```typescript
import { FaspayGateway } from '@indopay/faspay';

const gateway = new FaspayGateway(
  'MERCHANT-ID',
  'MERCHANT-NAME',
  'USER-ID',
  'PASSWORD'
);

// Use gateway.createPayment(...) as standard
```
