import { MidtransGateway } from '@indopay/midtrans';
import { CreatePaymentInput, PaymentMethodType, PaymentStatus, PaymentTransaction } from '@indopay/core';
import { MemoryTransactionRepository } from './infra/memory-repo';
import { ConsoleLogger } from './infra/console-logger';

async function runSimulation() {
  const logger = new ConsoleLogger();
  logger.info('Starting IndoPay Playground Simulation...');

  // Initialize Infrastructure
  const repo = new MemoryTransactionRepository();

  // Initialize Gateway (Midtrans Sandbox)
  const serverKey = 'SB-Mid-server-DUMMY_KEY';
  const gateway = new MidtransGateway(serverKey, false);

  // Mocking for Playground demonstration
  try {
      const nock = require('nock');
      nock('https://api.sandbox.midtrans.com/v2')
        .post('/charge')
        .reply(201, {
            status_code: "201",
            status_message: "Success, Credit Card transaction is successful",
            transaction_id: "TRX-PLAYGROUND-001",
            order_id: "ORDER-PLAY-001",
            gross_amount: "10000.00",
            currency: "IDR",
            payment_type: "credit_card",
            transaction_time: "2023-10-25 12:00:00",
            transaction_status: "capture",
            fraud_status: "accept"
        });
      logger.info('MOCKED Midtrans API for simulation.');
  } catch (e) {
      logger.warn('Nock not available, real network call will be made.');
  }

  // 1. Create Input
  const input: CreatePaymentInput = {
    amount: 10000,
    currency: 'IDR',
    referenceId: 'ORDER-PLAY-001',
    paymentMethod: PaymentMethodType.CREDIT_CARD,
    customer: {
      email: 'playground@indopay.com',
      firstName: 'Playground',
      lastName: 'User'
    }
  };

  logger.info('1. Created Payment Input', { referenceId: input.referenceId });

  try {
    // 2. Call Gateway
    const result = await gateway.createPayment(input);

    // 3. Log Result
    logger.info('2. Gateway Response Received', {
        status: result.status,
        id: result.id
    });

    // 4. Save to Repo
    // The repository expects a PaymentTransaction object.
    // 'result' IS a PaymentTransaction, so we should pass it directly.
    // But if we want to construct it manually or modify it, we must adhere to the interface.
    // The previous code was trying to create an object literal that didn't match PaymentTransaction perfectly
    // (it used 'raw' instead of 'rawResponse', and 'transactionId' instead of 'id').
    // However, `result` from createPayment IS a PaymentTransaction.
    // So we can just pass `result`.

    await repo.create(result);

    // 5. Fetch back
    const saved = await repo.findByReference(result.referenceId);

    // 6. Log Success
    if (saved) {
        logger.info('3. Transaction Saved & Retrieved Successfully', { savedStatus: saved.status });
        console.log('\n✅ SIMULATION SUCCESS\n');
    } else {
        logger.error('Transaction not found in repo!');
    }

  } catch (error: any) {
    logger.error('Simulation Failed', error);
  }
}

runSimulation();
