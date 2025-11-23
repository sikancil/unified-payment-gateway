import { Injectable, Inject } from '@nestjs/common';
import { IPaymentGateway } from '@indopay/core';
import { INDOPAY_OPTIONS } from './constants';
import { IndopayModuleOptions } from './interfaces';

@Injectable()
export class IndopayService {
  private readonly gateways: Map<string, IPaymentGateway> = new Map();
  private _defaultProvider: string | undefined;

  constructor(@Inject(INDOPAY_OPTIONS) options: IndopayModuleOptions) {
    options.providers.forEach(p => {
      this.register(p.name, p.gateway);
    });
    if (options.defaultProvider) {
      this.setDefault(options.defaultProvider);
    }
  }

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
