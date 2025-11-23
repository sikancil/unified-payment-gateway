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
import { generateDigest, generateSignature } from './utils';
import { DokuPaymentResponseSchema, DokuWebhookSchema } from './schemas';
import crypto from 'crypto';

export class DokuGateway implements IPaymentGateway {
  private readonly client: AxiosInstance;
  private readonly clientId: string;
  private readonly secretKey: string;
  private readonly isProduction: boolean;

  constructor(clientId: string, secretKey: string, isProduction: boolean = false) {
    this.clientId = clientId;
    this.secretKey = secretKey;
    this.isProduction = isProduction;

    const baseURL = isProduction
      ? 'https://api.doku.com'
      : 'https://api-sandbox.doku.com';

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async createPayment(input: CreatePaymentInput): Promise<PaymentTransaction> {
    try {
      const payload = this.mapInputToPayload(input);
      const payloadString = JSON.stringify(payload);

      const requestId = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      const requestTarget = '/checkout/v1/payment'; // Doku Jokul path

      const digest = generateDigest(payloadString);
      const signature = generateSignature(
          this.clientId,
          requestId,
          timestamp,
          requestTarget,
          digest,
          this.secretKey
      );

      const response = await this.client.post(requestTarget, payload, {
          headers: {
              'Client-Id': this.clientId,
              'Request-Id': requestId,
              'Request-Timestamp': timestamp,
              'Signature': signature,
              'Digest': digest
          }
      });

      const validatedResponse = DokuPaymentResponseSchema.parse(response.data);

      return this.mapResponseToTransaction(validatedResponse, input);

    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
           throw new PaymentProviderException(
               JSON.stringify(error.response.data) || 'Doku Error',
               'DOKU_ERROR',
               error.response.data
           );
      }
      if (error instanceof z.ZodError) {
          throw new PaymentProviderException('Invalid Doku Response Structure', 'PARSE_ERROR', error);
      }
      throw new PaymentProviderException('Unknown Doku Error', 'UNKNOWN', error);
    }
  }

  async verifySignature(payload: unknown, headers?: Record<string, string | string[] | undefined>): Promise<boolean> {
      // Doku Webhook Signature Verification
      // Headers usually contain: Client-Id, Request-Id, Request-Timestamp, Signature, Digest (maybe?)
      // We must reconstruct the signature using the payload and compare.

      if (!headers) throw new SignatureVerificationException('Missing headers');

      const clientId = headers['Client-Id'] as string; // Case sensitive? Axios lowercases usually.
      // Axios headers are lowercase: client-id
      const hClientId = headers['client-id'] as string || headers['Client-Id'] as string;
      const hRequestId = headers['request-id'] as string || headers['Request-Id'] as string;
      const hTimestamp = headers['request-timestamp'] as string || headers['Request-Timestamp'] as string;
      const hSignature = headers['signature'] as string || headers['Signature'] as string;
      const hRequestTarget = headers['request-target'] as string || headers['Request-Target'] as string; // Usually passed in notification? Or is it the path?
      // Notification path? Assuming passed or known.
      // Doku docs: Request-Target for notification is the path where it hit your server.
      // This is tricky as library might not know its own route.
      // However, usually Doku sends it in header? Or we assume root?
      // Let's assume passed in header if available, otherwise we might fail validation if not strictly adhering.
      // Actually Doku Jokul Notification uses "Request-Target" header.

      if (!hClientId || !hRequestId || !hTimestamp || !hSignature) {
           throw new SignatureVerificationException('Missing required headers for signature verification');
      }

      const payloadString = JSON.stringify(payload);
      const digest = generateDigest(payloadString);

      // Note: For notification, Request-Target is the path of our webhook endpoint.
      // We might need to accept it as an argument or infer it.
      // But verifySignature signature in interface is (payload, headers).
      // We can try to read 'request-target' from header if Doku sends it (they usually do).
      const requestTarget = (headers['request-target'] as string || headers['Request-Target'] as string);

      if (!requestTarget) {
           // We can't verify properly without knowing the target path used in signature generation
           throw new SignatureVerificationException('Missing Request-Target header');
      }

      const generatedSig = generateSignature(
          hClientId,
          hRequestId,
          hTimestamp,
          requestTarget,
          digest,
          this.secretKey
      );

      if (generatedSig !== hSignature) {
           throw new SignatureVerificationException('Invalid Doku Signature');
      }

      return true;
  }

  async processWebhook(payload: unknown): Promise<PaymentTransaction> {
      // Note: verifySignature should be called by the controller/host using the headers.
      // Here we parse payload.

      const validated = DokuWebhookSchema.parse(payload);

      return {
          id: validated.transaction.original_request_id, // Or invoice_number? Doku uses multiple IDs.
          referenceId: validated.order.invoice_number,
          amount: Number(validated.order.amount),
          currency: 'IDR',
          status: this.mapStatus(validated.transaction.status),
          paymentMethod: PaymentMethodType.VIRTUAL_ACCOUNT, // Inferred
          rawResponse: validated,
          createdAt: new Date(validated.transaction.date),
          updatedAt: new Date()
      };
  }

  private mapInputToPayload(input: CreatePaymentInput): object {
      return {
          order: {
              invoice_number: input.referenceId,
              amount: input.amount
          },
          payment: {
              payment_due_date: 60 // minutes, example
          },
          customer: {
              name: input.customer.firstName,
              email: input.customer.email
          }
      };
  }

  private mapResponseToTransaction(response: z.infer<typeof DokuPaymentResponseSchema>, input: CreatePaymentInput): PaymentTransaction {
      return {
          id: response.order.invoice_number, // Jokul mostly uses invoice_number as main ref
          referenceId: response.order.invoice_number,
          amount: Number(response.order.amount),
          currency: input.currency,
          status: PaymentStatus.PENDING,
          paymentMethod: input.paymentMethod,
          rawResponse: response,
          metadata: {
              virtual_account: response.virtual_account_info?.virtual_account_number
          },
          createdAt: new Date(),
          updatedAt: new Date()
      };
  }

  private mapStatus(status: string): PaymentStatus {
      switch (status) {
          case 'SUCCESS': return PaymentStatus.PAID;
          case 'FAILED': return PaymentStatus.FAILED;
          default: return PaymentStatus.PENDING;
      }
  }
}
