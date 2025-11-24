import { IPaymentGateway } from '@indopay/core';

export interface IndopayModuleOptions {
  defaultProvider?: string;
  providers: {
    name: string;
    gateway: IPaymentGateway;
  }[];
}

export interface IndopayModuleAsyncOptions {
  imports?: any[];
  useFactory: (...args: any[]) => Promise<IndopayModuleOptions> | IndopayModuleOptions;
  inject?: any[];
}
