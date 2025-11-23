import { CreatePaymentInput, PaymentTransaction } from './types';

export interface IPaymentGateway {
  /**
   * Initialize a charge/payment with the provider.
   */
  createPayment(input: CreatePaymentInput): Promise<PaymentTransaction>;

  /**
   * Verify a webhook signature.
   * Throws SignatureVerificationException if invalid.
   */
  verifySignature(payload: unknown, headers: Record<string, string | string[] | undefined>): Promise<boolean>;

  /**
   * Process a webhook payload and return a normalized PaymentTransaction.
   */
  processWebhook(payload: unknown): Promise<PaymentTransaction>;
}
