# @indopay/dbs

DBS RAPID Payment Gateway adapter for IndoPay using PGP Encryption.

## Installation

```bash
pnpm add @indopay/dbs @indopay/core
```

## PGP Keys Generation

You need to generate PGP keys using `openpgp` or GPG.

```bash
gpg --gen-key
gpg --armor --export "Your Name" > public.asc
gpg --armor --export-secret-key "Your Name" > private.asc
```

## Usage

```typescript
import { DbsGateway } from '@indopay/dbs';

const clientId = 'ORG-ID';
const privateKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----...`;
const bankPublicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----...`;

const gateway = new DbsGateway(clientId, privateKey, bankPublicKey);

// Use gateway.createPayment(...) as standard
```
