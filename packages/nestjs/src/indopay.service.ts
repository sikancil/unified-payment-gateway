import { Injectable, Inject } from '@nestjs/common';
import { IPaymentGateway } from '@indopay/core';
import { INDOPAY_OPTIONS } from './constants';
import { IndopayModuleOptions } from './interfaces';

@Injectable()
export class IndopayService {
  private readonly gateways: Map<string, IPaymentGateway> = new Map();

  constructor(
    @Inject(INDOPAY_OPTIONS) private readonly options: IndopayModuleOptions,
    // In a real scenario, we might inject the resolved provider instances if they were provided as standard providers
    // But here we are using a factory pattern inside the module to resolve them or instantiating them here.
    // However, the `providers` option has `useFactory`.
    // The module logic should resolve these factories and store them.
    // Simpler approach: The module registers the gateways as providers, and this service retrieves them or manages them.

    // Let's refine:
    // The instruction says: "A facade that holds the initialized Gateway instances."
    // "Factory Pattern: The service should allow retrieving a specific provider instance".
  ) {
      // This is tricky because factories need dependency injection context.
      // Better approach:
      // The module registers each provider with a unique token like `INDOPAY_PROVIDER_${name}`.
      // Or, the options simply define *how* to create them, but without DI context it's hard.

      // Alternative implementation for library:
      // Users pass instances or factories.
      // If factories, we need ModuleRef.
  }

  // To keep it simple and robust for a library wrapper:
  // We will rely on the user registering the specific Gateway implementations in their module,
  // and we provide a way to access them or register them via our module.

  // BUT, instruction says `IndopayModule.forRoot` logic.
  // Let's implement a Module that takes a list of Gateway Instances or configurations.

  // Revision:
  // options.providers should probably be instantiated objects for simplicity in `forRoot`,
  // OR we accept a config object and instantiate standard adapters if dependencies are minimal.
  // But standard adapters need secrets.

  // Let's assume `providers` in options is an array of { name: string, gateway: IPaymentGateway }.
  // This is the cleanest IoC. The user instantiates `new MidtransGateway(...)` and passes it.

  private _defaultProvider: string | undefined;

  register(name: string, gateway: IPaymentGateway) {
      this.gateways.set(name, gateway);
  }

  getGateway(name?: string): IPaymentGateway {
      const target = name || this._defaultProvider;
      if (!target) {
          throw new Error('No provider specified and no default provider set.');
      }
      const gateway = this.gateways.get(target);
      if (!gateway) {
          throw new Error(`Payment Gateway provider '${target}' not found.`);
      }
      return gateway;
  }

  setDefault(name: string) {
      this._defaultProvider = name;
  }
}
