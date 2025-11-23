Jules, final verification step.

**Action Required:**
1.  **Root Build**:
    *   Run `pnpm build` from the root. This must build `core`, `contracts`, and all provider packages via Turbo.

2.  **Root Test**:
    *   Run `pnpm test` from the root. This should trigger Jest in all packages.

3.  **Documentation**:
    *   Update `README.md` in the root.
    *   List all supported packages: `@indopay/midtrans`, `@indopay/xendit`, `@indopay/faspay`, `@indopay/dbs`, `@indopay/doku`, `@indopay/ipaymu`.
    *   Add a snippet showing how to install and usage example.
