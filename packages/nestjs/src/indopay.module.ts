import { DynamicModule, Module, Global } from '@nestjs/common';
import { IndopayService } from './indopay.service';
import { IndopayModuleOptions, IndopayModuleAsyncOptions } from './interfaces';
import { INDOPAY_OPTIONS } from './constants';

@Global()
@Module({})
export class IndopayModule {
  static forRoot(options: IndopayModuleOptions): DynamicModule {
    return {
      module: IndopayModule,
      providers: [
        {
          provide: INDOPAY_OPTIONS,
          useValue: options,
        },
        IndopayService,
      ],
      exports: [IndopayService],
    };
  }

  static forRootAsync(options: IndopayModuleAsyncOptions): DynamicModule {
    return {
      module: IndopayModule,
      imports: options.imports || [],
      providers: [
        {
          provide: INDOPAY_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        IndopayService,
      ],
      exports: [IndopayService],
    };
  }
}
