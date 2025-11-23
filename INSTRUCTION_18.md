Jules, we need to refine the **NestJS Wrapper** to ensure it works perfectly with Dependency Injection (e.g., `ConfigService`).

**Action Required:**
1.  **Refactor Interfaces (`packages/nestjs/src/interfaces.ts`)**:
    *   Change `IndopayModuleOptions` to accept instances, not factories.
    *   Structure:
        ```typescript
        export interface IndopayModuleOptions {
          defaultProvider?: string;
          providers: {
            name: string;
            gateway: IPaymentGateway; // Pass the instance directly
          }[];
        }
        ```

2.  **Refactor Module (`packages/nestjs/src/indopay.module.ts`)**:
    *   Simplify `forRoot` and `forRootAsync`.
    *   Remove the complex `useFactory` loop.
    *   Simply take the `options.providers` array and register them in `IndopayService`.

3.  **Refactor Service (`packages/nestjs/src/indopay.service.ts`)**:
    *   Update to handle the new options structure.
