import { DynamicModule, Module, Provider, Global } from '@nestjs/common';
import { IndopayService } from './indopay.service';
import { IndopayModuleOptions, IndopayModuleAsyncOptions } from './interfaces';
import { INDOPAY_OPTIONS } from './constants';

@Global()
@Module({})
export class IndopayModule {
  static forRoot(options: IndopayModuleOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: INDOPAY_OPTIONS,
        useValue: options,
      },
      IndopayService,
      // Register the actual gateways?
      // We need to instantiate them and register them in the service.
      // Since `options.providers` contains factories, we can create a provider that runs them.
      ...options.providers.map(p => ({
          provide: `INDOPAY_GATEWAY_${p.name}`,
          useFactory: async (...args: any[]) => {
              const gateway = await p.useFactory(...args);
              // We can't easily inject IndopayService here to register it without circular dependency or complex setup.
              // Better: IndopayService injects `ModuleRef` and retrieves them, or we use a setup provider.
              return gateway;
          },
          inject: p.inject || []
      })),
      {
          provide: 'INDOPAY_SETUP',
          useFactory: (service: IndopayService, ...gateways: any[]) => {
              options.providers.forEach((p, index) => {
                  service.register(p.name, gateways[index]);
              });
              if (options.defaultProvider) {
                  service.setDefault(options.defaultProvider);
              }
          },
          inject: [IndopayService, ...options.providers.map(p => `INDOPAY_GATEWAY_${p.name}`)]
      }
    ];

    return {
      module: IndopayModule,
      providers: providers,
      exports: [IndopayService],
    };
  }

  static forRootAsync(options: IndopayModuleAsyncOptions): DynamicModule {
      // Async configuration usually resolves the OPTIONS, not the providers list dynamically in a complex way.
      // For simplicity in this wrapper, we assume the `useFactory` returns the `IndopayModuleOptions` object.

      return {
          module: IndopayModule,
          imports: [],
          providers: [
              {
                  provide: INDOPAY_OPTIONS,
                  useFactory: options.useFactory,
                  inject: options.inject || []
              },
              IndopayService,
              {
                  provide: 'INDOPAY_SETUP_ASYNC',
                  useFactory: async (service: IndopayService, opt: IndopayModuleOptions) => {
                      // Here we have to instantiate the providers manually or handle them.
                      // This is complex because the providers inside options might need DI.
                      // If `opt.providers` are just objects, it's easy.
                      // If they are factories, we can't easily run them here without the Module context they expect.

                      // COMPROMISE for Phase 5:
                      // We assume forRootAsync returns options where providers are ALREADY instantiated or simple factories
                      // that don't require NestJS DI (basic functions).
                      // OR we iterate and call them if they are functions.

                      for (const p of opt.providers) {
                          // We assume useFactory here is a simple function returning the instance
                          // If it needs injection, forRootAsync logic gets very hard without creating dynamic providers from the result of another provider.

                          // Let's support simple factory: () => Gateway
                          const gateway = await p.useFactory();
                          service.register(p.name, gateway);
                      }
                      if (opt.defaultProvider) {
                          service.setDefault(opt.defaultProvider);
                      }
                  },
                  inject: [IndopayService, INDOPAY_OPTIONS]
              }
          ],
          exports: [IndopayService]
      };
  }
}
