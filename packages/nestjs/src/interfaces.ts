import { IPaymentGateway } from '@indopay/core';

export interface IndopayModuleOptions {
  defaultProvider?: string;
  providers: {
    name: string;
    useFactory: (...args: any[]) => IPaymentGateway;
    inject?: any[];
  }[];
}

export interface IndopayModuleAsyncOptions {
  useFactory: (...args: any[]) => Promise<IndopayModuleOptions> | IndopayModuleOptions;
  inject?: any[];
}
