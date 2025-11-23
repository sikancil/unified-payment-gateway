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
import { z } from 'zod';
import {
  XenditInvoiceRequestSchema,
  XenditInvoiceResponseSchema,
  XenditWebhookSchema
} from './schemas';

export class XenditGateway implements IPaymentGateway {
  private readonly client: AxiosInstance;
  private readonly callbackToken: string;

  constructor(secretKey: string, callbackToken: string) {
    this.callbackToken = callbackToken;
    this.client = axios.create({
      baseURL: 'https://api.xendit.co/v2',
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: secretKey,
        password: '', // Basic Auth with empty password
      },
    });
  }

  async createPayment(input: CreatePaymentInput): Promise<PaymentTransaction> {
    try {
      const payload = this.mapInputToPayload(input);
      // Validate Payload
      const validatedPayload = XenditInvoiceRequestSchema.parse(payload);

      const response = await this.client.post('/invoices', validatedPayload);

      // Validate Response
      const validatedResponse = XenditInvoiceResponseSchema.parse(response.data);

      return this.mapResponseToTransaction(validatedResponse, input);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
         throw new PaymentProviderException(
          (error.response.data as any).message || 'Xendit Error',
          (error.response.data as any).error_code || 'XENDIT_ERROR',
          error.response.data
        );
      }
      if (error instanceof Error) {
         throw new PaymentProviderException(error.message, 'UNKNOWN', error);
      }
      throw new PaymentProviderException('Unknown Error', 'UNKNOWN', error);
    }
  }

  async verifySignature(payload: unknown, headers?: Record<string, string | string[] | undefined>): Promise<boolean> {
     const token = headers?.['x-callback-token'];

     if (!token) {
        throw new SignatureVerificationException('Missing x-callback-token header');
     }

     if (token !== this.callbackToken) {
        throw new SignatureVerificationException('Invalid callback token');
     }

     return true;
  }

  async processWebhook(payload: unknown): Promise<PaymentTransaction> {
     // Validate schema
     const validatedPayload = XenditWebhookSchema.parse(payload);

     // Note: Signature verification happens separately in verifySignature as per architecture

     return {
        id: validatedPayload.id,
        referenceId: validatedPayload.external_id,
        amount: validatedPayload.amount,
        currency: validatedPayload.currency,
        status: this.mapXenditStatus(validatedPayload.status),
        paymentMethod: this.mapPaymentMethod(validatedPayload.payment_method),
        rawResponse: validatedPayload,
        createdAt: new Date(validatedPayload.created),
        updatedAt: new Date(validatedPayload.updated),
     };
  }

  private mapInputToPayload(input: CreatePaymentInput): unknown {
    return {
      external_id: input.referenceId,
      amount: input.amount,
      payer_email: input.customer.email,
      description: input.description,
      customer: {
        given_names: input.customer.firstName,
        surname: input.customer.lastName,
        email: input.customer.email,
        mobile_number: input.customer.phone,
      },
      currency: input.currency,
    };
  }

  private mapResponseToTransaction(response: z.infer<typeof XenditInvoiceResponseSchema>, input: CreatePaymentInput): PaymentTransaction {
     return {
        id: response.id,
        referenceId: response.external_id,
        amount: response.amount,
        currency: response.currency,
        status: this.mapXenditStatus(response.status),
        paymentMethod: input.paymentMethod, // Xendit Invoice can be paid by multiple methods
        rawResponse: response,
        metadata: {
           invoice_url: response.invoice_url
        },
        createdAt: new Date(response.created),
        updatedAt: new Date(response.updated)
     };
  }

  private mapXenditStatus(status: string): PaymentStatus {
     switch (status) {
        case 'PAID':
        case 'SETTLED':
           return PaymentStatus.PAID;
        case 'PENDING':
           return PaymentStatus.PENDING;
        case 'EXPIRED':
           return PaymentStatus.EXPIRED;
        default:
           return PaymentStatus.FAILED;
     }
  }

  private mapPaymentMethod(method?: string): PaymentMethodType {
    // Xendit might return different strings
    if (!method) return PaymentMethodType.RETAIL_OUTLET; // fallback

    switch (method) {
        case 'CREDIT_CARD': return PaymentMethodType.CREDIT_CARD;
        case 'BANK_TRANSFER':
        case 'VIRTUAL_ACCOUNT': return PaymentMethodType.VIRTUAL_ACCOUNT;
        case 'EWALLET': return PaymentMethodType.EWALLET;
        case 'QR_CODE': return PaymentMethodType.QRIS;
        case 'RETAIL_OUTLET': return PaymentMethodType.RETAIL_OUTLET;
        case 'DIRECT_DEBIT': return PaymentMethodType.DIRECT_DEBIT;
        default: return PaymentMethodType.RETAIL_OUTLET;
    }
  }
}
