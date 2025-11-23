import { XenditGateway } from './xendit.adapter';
import { PaymentMethodType, PaymentStatus, CreatePaymentInput, SignatureVerificationException } from '@indopay/core';
import nock from 'nock';
import invoiceResponse from '../__fixtures__/invoice_response.json';
import webhookPayload from '../__fixtures__/webhook_payload.json';

describe('XenditGateway', () => {
  const secretKey = 'xnd_development_...';
  const callbackToken = 'verification_token_123';
  const gateway = new XenditGateway(secretKey, callbackToken);

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('createPayment', () => {
    it('should create an invoice and return transaction', async () => {
      const scope = nock('https://api.xendit.co/v2')
        .post('/invoices')
        .reply(200, invoiceResponse);

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

      expect(result).toBeDefined();
      expect(result.id).toBe(invoiceResponse.id);
      expect(result.status).toBe(PaymentStatus.PENDING);
      expect(result.metadata?.invoice_url).toBe(invoiceResponse.invoice_url);
      expect(scope.isDone()).toBe(true);
    });
  });

  describe('verifySignature', () => {
    it('should verify with valid x-callback-token', async () => {
      const headers = { 'x-callback-token': callbackToken };
      const isValid = await gateway.verifySignature({}, headers);
      expect(isValid).toBe(true);
    });

    it('should throw if token is missing', async () => {
        await expect(gateway.verifySignature({}, {}))
            .rejects.toThrow(SignatureVerificationException);
    });

    it('should throw if token is invalid', async () => {
        const headers = { 'x-callback-token': 'wrong_token' };
        await expect(gateway.verifySignature({}, headers))
            .rejects.toThrow(SignatureVerificationException);
    });
  });

  describe('processWebhook', () => {
     it('should parse valid webhook', async () => {
         const result = await gateway.processWebhook(webhookPayload);

         expect(result.id).toBe(webhookPayload.id);
         expect(result.status).toBe(PaymentStatus.PAID);
         expect(result.amount).toBe(webhookPayload.amount);
     });
  });
});
