Jules, all providers are done. Now implementing **Phase 5: Framework Integration**.
Create the NestJS wrapper.

**Action Required:**
1.  **Initialize Package**:
    *   Create `packages/nestjs` (`@indopay/nestjs`).
    *   Dependencies: `@nestjs/common`, `@nestjs/core`, `@indopay/core`, `rxjs`.
    *   Peer Dependencies: `@nestjs/common`, `reflect-metadata`.

2.  **Module Logic**:
    *   Create `src/indopay.module.ts`: Implement `forRoot` and `forRootAsync`.
    *   Create `src/indopay.service.ts`: A facade that holds the initialized Gateway instances.
    *   **Factory Pattern**: The service should allow retrieving a specific provider instance (e.g., `service.getGateway('midtrans')`).

3.  **Dependency Injection**:
    *   Ensure `IndopayService` can be injected into other NestJS services.
