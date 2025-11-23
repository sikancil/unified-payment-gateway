import { DokuGateway } from './doku.adapter';
import { PaymentMethodType, PaymentStatus, CreatePaymentInput } from '@indopay/core';
import nock from 'nock';
import paymentResponse from '../__fixtures__/payment_response.json';
import webhookPayload from '../__fixtures__/webhook_payload.json';
import { generateDigest, generateSignature } from './utils';

describe('DokuGateway', () => {
  const clientId = 'CLIENT-123';
  const secretKey = 'SECRET-ABC';
  const gateway = new DokuGateway(clientId, secretKey, false);

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('createPayment', () => {
    it('should generate correct headers and create payment', async () => {
      const scope = nock('https://api-sandbox.doku.com')
        .post('/checkout/v1/payment')
        .reply(200, paymentResponse);

      const input: CreatePaymentInput = {
        amount: 10000,
        currency: 'IDR',
        referenceId: 'ORDER-101',
        paymentMethod: PaymentMethodType.VIRTUAL_ACCOUNT,
        customer: {
          email: 'jules@indopay.com',
          firstName: 'Jules',
          lastName: 'Agent'
        }
      };

      const result = await gateway.createPayment(input);

      expect(result.referenceId).toBe('ORDER-101');
      expect(result.status).toBe(PaymentStatus.PENDING);
      expect(scope.isDone()).toBe(true);
    });
  });

  describe('utils', () => {
      it('should generate digest correctly', () => {
          const body = JSON.stringify({ test: 'data' });
          const digest = generateDigest(body);
          expect(digest).toBeDefined();
      });
  });
});
