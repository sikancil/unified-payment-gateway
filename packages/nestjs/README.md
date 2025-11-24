# @indopay/nestjs

NestJS wrapper for IndoPay.

## Installation

```bash
pnpm add @indopay/nestjs @indopay/core @indopay/midtrans
```

## Usage

In `app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { IndopayModule } from '@indopay/nestjs';
import { MidtransGateway } from '@indopay/midtrans';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    IndopayModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        providers: [
          {
            name: 'midtrans',
            gateway: new MidtransGateway(config.get('MIDTRANS_KEY'), false),
          },
        ],
        defaultProvider: 'midtrans',
      }),
    }),
  ],
})
export class AppModule {}
```

In your service:

```typescript
import { Injectable } from '@nestjs/common';
import { IndopayService } from '@indopay/nestjs';

@Injectable()
export class AppService {
  constructor(private readonly indopay: IndopayService) {}

  async pay() {
    const gateway = this.indopay.getGateway('midtrans');
    return gateway.createPayment({ ... });
  }
}
```
