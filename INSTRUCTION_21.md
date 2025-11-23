Jules, generic documentation is not enough. Create specific `README.md` files for each package.

**Action Required:**
1.  **`packages/midtrans/README.md`**:
    *   Explain `new MidtransGateway(serverKey, isProduction)`.
    *   Show how to handle Webhooks using `gateway.processWebhook`.

2.  **`packages/dbs/README.md`**:
    *   **CRITICAL**: Explain how to generate PGP keys using `openpgp` or GPG.
    *   Show how to pass `privateKey` and `bankPublicKey` to the constructor.

3.  **`packages/faspay/README.md`**:
    *   Explain the User ID / Password / Merchant ID requirement.

4.  **`packages/nestjs/README.md`**:
    *   Show the `IndopayModule.forRoot` example with `ConfigService`.
    *   Example:
        ```typescript
        useFactory: (config: ConfigService) => new MidtransGateway(config.get('MIDTRANS_KEY'))
        ```
