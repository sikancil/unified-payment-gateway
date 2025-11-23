import { IpaymuGateway } from './ipaymu.adapter';
import { PaymentMethodType, PaymentStatus, CreatePaymentInput } from '@indopay/core';
import nock from 'nock';
import paymentResponse from '../__fixtures__/payment_response.json';

describe('IpaymuGateway', () => {
  const apiKey = 'apikey-123';
  const va = '1179000';
  const gateway = new IpaymuGateway(apiKey, va, false);

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('createPayment', () => {
    it('should create payment and return transaction', async () => {
      const scope = nock('https://sandbox.ipaymu.com/api/v2')
        .post('/payment/direct')
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
      expect(result.metadata?.payment_no).toBe('1234567890');
      expect(scope.isDone()).toBe(true);
    });
  });
});
