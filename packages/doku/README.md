# @indopay/doku

Doku (Jokul) Payment Gateway adapter for IndoPay.

## Installation

```bash
pnpm add @indopay/doku @indopay/core
```

## Usage

```typescript
import { DokuGateway } from '@indopay/doku';

const gateway = new DokuGateway('CLIENT-ID', 'SECRET-KEY', false);

// Use gateway.createPayment(...) as standard
```
