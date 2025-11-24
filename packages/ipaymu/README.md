# @indopay/ipaymu

iPaymu Payment Gateway adapter for IndoPay.

## Installation

```bash
pnpm add @indopay/ipaymu @indopay/core
```

## Usage

```typescript
import { IpaymuGateway } from '@indopay/ipaymu';

const gateway = new IpaymuGateway('API-KEY', 'VA-NUMBER', false);

// Use gateway.createPayment(...) as standard
```
