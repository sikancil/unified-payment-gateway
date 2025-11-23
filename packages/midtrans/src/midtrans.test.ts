import { MidtransGateway } from './midtrans.adapter';
import { PaymentMethodType, PaymentStatus, CreatePaymentInput } from '@indopay/core';
import nock from 'nock';
import crypto from 'crypto';
import chargeResponseSuccess from '../__fixtures__/charge_response_success.json';
import webhookPayload from '../__fixtures__/webhook_payload.json';

describe('MidtransGateway', () => {
  const serverKey = 'SB-Mid-server-12345';
  const gateway = new MidtransGateway(serverKey, false); // Sandbox

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('createPayment', () => {
    it('should create a payment successfully and return normalized transaction', async () => {
      const scope = nock('https://api.sandbox.midtrans.com/v2')
        .post('/charge')
        .reply(201, chargeResponseSuccess);

      const input: CreatePaymentInput = {
        amount: 10000,
        currency: 'IDR',
        referenceId: 'ORDER-101',
        paymentMethod: PaymentMethodType.CREDIT_CARD,
        customer: {
          email: 'jules@indopay.com',
          firstName: 'Jules',
          lastName: 'Agent'
        }
      };

      const result = await gateway.createPayment(input);

      expect(result).toBeDefined();
      expect(result.id).toBe(chargeResponseSuccess.transaction_id);
      expect(result.status).toBe(PaymentStatus.PAID); // capture maps to PAID
      expect(result.amount).toBe(10000);
      expect(scope.isDone()).toBe(true);
    });
  });

  describe('verifySignature', () => {
    it('should verify valid signature', async () => {
      // Re-calculate signature to ensure test validity
      // SHA512(order_id + status_code + gross_amount + ServerKey)
      const { order_id, status_code, gross_amount } = webhookPayload;
      const signature = crypto.createHash('sha512')
          .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
          .digest('hex');

      const payload = { ...webhookPayload, signature_key: signature };

      const isValid = await gateway.verifySignature(payload);
      expect(isValid).toBe(true);
    });

    it('should throw error on invalid signature', async () => {
      const payload = { ...webhookPayload, signature_key: 'wrong_key' };
      await expect(gateway.verifySignature(payload)).rejects.toThrow('Invalid signature');
    });
  });

  describe('processWebhook', () => {
     it('should process valid webhook and return transaction', async () => {
        // Mock signature verification passing
        const { order_id, status_code, gross_amount } = webhookPayload;
        const signature = crypto.createHash('sha512')
            .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
            .digest('hex');

        const payload = { ...webhookPayload, signature_key: signature };

        const result = await gateway.processWebhook(payload);

        expect(result.id).toBe(payload.transaction_id);
        expect(result.status).toBe(PaymentStatus.PAID); // settlement maps to PAID
        expect(result.referenceId).toBe(payload.order_id);
     });
  });
});
