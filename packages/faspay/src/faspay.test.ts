import { FaspayGateway } from './faspay.adapter';
import { PaymentMethodType, PaymentStatus, CreatePaymentInput } from '@indopay/core';
import nock from 'nock';
import { readFileSync } from 'fs';
import path from 'path';

// Read raw XML fixtures
const paymentResponseXml = readFileSync(
  path.join(__dirname, '../__fixtures__/payment_response.xml'),
  'utf-8'
);

const notificationXml = readFileSync(
    path.join(__dirname, '../__fixtures__/payment_notification.xml'),
    'utf-8'
);

describe('FaspayGateway', () => {
  const merchantId = '300011';
  const merchantName = 'IndoPay Demo';
  const userId = 'user123';
  const password = 'password123';

  const gateway = new FaspayGateway(merchantId, merchantName, userId, password);

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('createPayment', () => {
    it('should create payment via XML and return transaction', async () => {
      const scope = nock('https://web.faspay.co.id')
        .post('/cvr/300011/10')
        .reply(200, paymentResponseXml);

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

      expect(result.id).toBe('TRX-123456789');
      expect(result.status).toBe(PaymentStatus.PENDING);
      expect(result.metadata?.redirect_url).toContain('faspay.co.id');
      expect(scope.isDone()).toBe(true);
    });
  });

  describe('processWebhook', () => {
      it('should parse XML webhook and verify signature', async () => {
          // Mock signature verification calculation
          // In test we need to match the signature expected by the logic.
          // The fixture has <signature>generated_signature_hash</signature>.
          // The logic calculates: sha1(md5(user+pass) + bill_no + code)
          // user=user123, pass=password123, bill_no=ORDER-101, code=2

          const crypto = require('crypto');
          const userPassHash = crypto.createHash('md5').update(userId + password).digest('hex');
          const expectedSig = crypto.createHash('sha1').update(userPassHash + 'ORDER-101' + '2').digest('hex');

          // Replace signature in XML with valid one
          const validXml = notificationXml.replace('generated_signature_hash', expectedSig);

          const result = await gateway.processWebhook(validXml);

          expect(result.id).toBe('TRX-123456789');
          expect(result.status).toBe(PaymentStatus.PAID);
      });
  });
});
