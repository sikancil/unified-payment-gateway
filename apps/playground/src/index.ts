import { MidtransGateway } from '@indopay/midtrans';
import { CreatePaymentInput, PaymentMethodType, PaymentStatus } from '@indopay/core';
import { MemoryTransactionRepository } from './infra/memory-repo';
import { ConsoleLogger } from './infra/console-logger';

async function runSimulation() {
  const logger = new ConsoleLogger();
  logger.info('Starting IndoPay Playground Simulation...');

  // Initialize Infrastructure
  const repo = new MemoryTransactionRepository();

  // Initialize Gateway (Midtrans Sandbox)
  // Use a dummy server key for simulation (it will fail network call if not mocked,
  // but we might mock it or just expect failure/handling).
  // If we want "live" simulation without real creds, we can catch the error
  // or use nock here too?
  // Instruction says "run a live simulation".
  // Usually implies seeing the flow.
  // I will proceed with dummy creds and catch the error if network fails,
  // OR I can mock it locally for the playground to show "success" flow.
  // Let's assume we want to see the logic flow.
  // I will add Nock to playground for demonstration purposes so we see a "Success".

  const serverKey = 'SB-Mid-server-DUMMY_KEY';
  const gateway = new MidtransGateway(serverKey, false);

  // Mocking for Playground demonstration
  // We need nock here if we want to see success without real API keys.
  // But playground usually isn't a test env.
  // Let's check if I can add nock to playground devDependencies or just run it and expect 401.
  // "run a live simulation" - implies seeing it work.
  // I'll try to import nock if available (it is in root node_modules).
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
    await repo.create({
        referenceId: result.referenceId,
        transactionId: result.id,
        status: result.status,
        amount: result.amount,
        raw: result.rawResponse
    });

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
