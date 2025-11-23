import { DbsGateway } from './dbs.adapter';
import { PaymentMethodType, PaymentStatus, CreatePaymentInput } from '@indopay/core';
import nock from 'nock';
import { TEST_PRIVATE_KEY, TEST_PUBLIC_KEY } from '../__fixtures__/keys';
import paymentResponse from '../__fixtures__/payment_response.json';
import * as openpgp from 'openpgp';

describe('DbsGateway', () => {
  const clientId = 'ORG-123';
  // For testing, we use the same key pair for "bank" and "client" to simplify
  // In reality, bank has its own key pair.
  const gateway = new DbsGateway(clientId, TEST_PRIVATE_KEY, TEST_PUBLIC_KEY);

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('createPayment', () => {
    it('should encrypt request and decrypt response', async () => {
      // Prepare encrypted response mock
      const publicKey = await openpgp.readKey({ armoredKey: TEST_PUBLIC_KEY });
      const message = await openpgp.createMessage({ text: JSON.stringify(paymentResponse) });
      const encryptedResponse = await openpgp.encrypt({
          message,
          encryptionKeys: publicKey
      });

      const scope = nock('https://ideal.dbs.com/api/v1')
        .post('/payments', (body) => {
            // Verify body is encrypted (starts with PGP header)
            return typeof body === 'string' && body.includes('-----BEGIN PGP MESSAGE-----');
        })
        .reply(200, encryptedResponse);

      const input: CreatePaymentInput = {
        amount: 10000,
        currency: 'IDR',
        referenceId: 'ORDER-101',
        paymentMethod: PaymentMethodType.DIRECT_DEBIT,
        customer: {
          email: 'jules@indopay.com',
          firstName: 'Jules',
          lastName: 'Agent'
        }
      };

      const result = await gateway.createPayment(input);

      expect(result.id).toBe('TRX-123456789');
      expect(result.status).toBe(PaymentStatus.PAID);
      expect(scope.isDone()).toBe(true);
    });
  });
});
