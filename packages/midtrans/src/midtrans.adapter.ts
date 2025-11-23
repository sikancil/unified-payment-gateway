import {
  IPaymentGateway,
  CreatePaymentInput,
  PaymentTransaction,
  PaymentStatus,
  PaymentMethodType,
  PaymentProviderException,
  SignatureVerificationException,
  ValidationError,
  CustomerDetails
} from '@indopay/core';
import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import { z } from 'zod'; // Added import
import { MidtransChargeSchema, MidtransResponseSchema, MidtransWebhookSchema, MidtransChargePayload } from './schemas';

export class MidtransGateway implements IPaymentGateway {
  private readonly client: AxiosInstance;
  private readonly serverKey: string;
  private readonly isProduction: boolean;

  constructor(serverKey: string, isProduction: boolean = false) {
    this.serverKey = serverKey;
    this.isProduction = isProduction;
    const baseURL = isProduction
      ? 'https://api.midtrans.com/v2'
      : 'https://api.sandbox.midtrans.com/v2';

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(serverKey + ':').toString('base64')}`,
      },
    });
  }

  async createPayment(input: CreatePaymentInput): Promise<PaymentTransaction> {
    try {
      const payload = this.mapInputToPayload(input);
      // Validate Payload
      const validatedPayload = MidtransChargeSchema.parse(payload);

      const response = await this.client.post('/charge', validatedPayload);

      // Validate Response
      const validatedResponse = MidtransResponseSchema.parse(response.data);

      return this.mapResponseToTransaction(validatedResponse, input);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
         throw new PaymentProviderException(
          (error.response.data as any).status_message || 'Midtrans Error',
          (error.response.data as any).status_code || 'MIDTRANS_ERROR',
          error.response.data
        );
      }
      // Wrap Zod errors or other unknown errors
      if (error instanceof Error) {
         throw new PaymentProviderException(error.message, 'UNKNOWN', error);
      }
      throw new PaymentProviderException('Unknown Error', 'UNKNOWN', error);
    }
  }

  async verifySignature(payload: unknown, headers?: Record<string, string | string[] | undefined>): Promise<boolean> {
     // Validate basic structure needed for signature first, or at least safe access
     const result = MidtransWebhookSchema.safeParse(payload);
     if (!result.success) {
         throw new SignatureVerificationException('Invalid payload structure for signature verification', result.error);
     }

     const { order_id, status_code, gross_amount, signature_key } = result.data;

     const inputString = `${order_id}${status_code}${gross_amount}${this.serverKey}`;
     const generatedSignature = crypto.createHash('sha512').update(inputString).digest('hex');

     if (generatedSignature !== signature_key) {
        throw new SignatureVerificationException('Invalid signature');
     }

     return true;
  }

  async processWebhook(payload: unknown): Promise<PaymentTransaction> {
     // Validate schema first
     const validatedPayload = MidtransWebhookSchema.parse(payload);

     // Verify signature
     await this.verifySignature(validatedPayload);

     return {
        id: validatedPayload.transaction_id,
        referenceId: validatedPayload.order_id,
        amount: parseFloat(validatedPayload.gross_amount),
        currency: validatedPayload.currency || 'IDR',
        status: this.mapMidtransStatus(validatedPayload.transaction_status),
        paymentMethod: this.mapPaymentType(validatedPayload.payment_type),
        rawResponse: validatedPayload,
        createdAt: new Date(validatedPayload.transaction_time),
        updatedAt: new Date(),
     };
  }

  private mapInputToPayload(input: CreatePaymentInput): MidtransChargePayload {
    return {
      payment_type: this.mapPaymentMethodToMidtrans(input.paymentMethod),
      transaction_details: {
        order_id: input.referenceId,
        gross_amount: input.amount,
      },
      customer_details: {
        first_name: input.customer.firstName,
        last_name: input.customer.lastName,
        email: input.customer.email,
        phone: input.customer.phone,
      },
      ...(input.paymentMethod === PaymentMethodType.CREDIT_CARD ? {
          credit_card: { secure: true }
      } : {}),
      ...(input.paymentMethod === PaymentMethodType.VIRTUAL_ACCOUNT ? {
           bank_transfer: { bank: 'bca' }
      } : {})
    };
  }

  private mapResponseToTransaction(response: z.infer<typeof MidtransResponseSchema>, input: CreatePaymentInput): PaymentTransaction {
     return {
        id: response.transaction_id,
        referenceId: response.order_id,
        amount: parseFloat(response.gross_amount),
        currency: response.currency || input.currency,
        status: this.mapMidtransStatus(response.transaction_status),
        paymentMethod: input.paymentMethod,
        rawResponse: response,
        createdAt: new Date(response.transaction_time),
        updatedAt: new Date()
     };
  }

  private mapMidtransStatus(status: string): PaymentStatus {
     switch (status) {
        case 'capture':
        case 'settlement':
           return PaymentStatus.PAID;
        case 'pending':
           return PaymentStatus.PENDING;
        case 'deny':
        case 'cancel':
        case 'expire':
        case 'failure':
           return PaymentStatus.FAILED;
        case 'refund':
           return PaymentStatus.REFUNDED;
        default:
           return PaymentStatus.PENDING;
     }
  }

  private mapPaymentMethodToMidtrans(method: PaymentMethodType): string {
     switch (method) {
        case PaymentMethodType.CREDIT_CARD: return 'credit_card';
        case PaymentMethodType.VIRTUAL_ACCOUNT: return 'bank_transfer';
        case PaymentMethodType.EWALLET: return 'gopay';
        case PaymentMethodType.QRIS: return 'qris';
        default: return 'other';
     }
  }

  private mapPaymentType(type: string): PaymentMethodType {
      if (type === 'credit_card') return PaymentMethodType.CREDIT_CARD;
      if (type === 'bank_transfer') return PaymentMethodType.VIRTUAL_ACCOUNT;
      if (type === 'gopay' || type === 'shopeepay') return PaymentMethodType.EWALLET;
      if (type === 'qris') return PaymentMethodType.QRIS;
      return PaymentMethodType.RETAIL_OUTLET;
  }
}
