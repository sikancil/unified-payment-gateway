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
import crypto from 'crypto';
import { generateSignature, parseXml } from './utils';
import { FaspayPaymentResponseSchema, FaspayNotificationSchema } from './schemas';

export class FaspayGateway implements IPaymentGateway {
  private readonly client: AxiosInstance;
  private readonly merchantId: string;
  private readonly merchantName: string;
  private readonly userId: string;
  private readonly password: string;

  constructor(merchantId: string, merchantName: string, userId: string, password: string) {
    this.merchantId = merchantId;
    this.merchantName = merchantName;
    this.userId = userId;
    this.password = password;

    this.client = axios.create({
      baseURL: 'https://web.faspay.co.id/cvr/300011/10', // Dev/Sandbox URL often has ID in path, or fixed path.
      // Instructions said: POST to https://web.faspay.co.id/cvr/300011/10
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }

  async createPayment(input: CreatePaymentInput): Promise<PaymentTransaction> {
    try {
      const signature = generateSignature(this.userId, this.password, input.referenceId);

      const xmlPayload = this.mapInputToXml(input, signature);

      // Faspay usually expects raw XML string in body
      const response = await this.client.post('', xmlPayload); // Path defined in baseURL or here?
      // Assuming baseURL is the full endpoint for this exercise instruction

      // Ensure response.data is a string before parsing
      const responseData = typeof response.data === 'string' ? response.data : String(response.data);
      const parsedData = parseXml(responseData);

      // Validate with Zod
      const validatedResponse = FaspayPaymentResponseSchema.parse(parsedData);

      if (validatedResponse.faspay.response_code !== '00') {
          throw new PaymentProviderException(
              (validatedResponse.faspay.response_desc as string) || 'Faspay Error',
              validatedResponse.faspay.response_code
          );
      }

      return this.mapResponseToTransaction(validatedResponse, input);

    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
          throw new PaymentProviderException('Invalid XML Response Structure', 'XML_PARSE_ERROR', error);
      }
      if (axios.isAxiosError(error)) {
          throw new PaymentProviderException('Network Error', 'NETWORK_ERROR', error);
      }
      if (error instanceof PaymentProviderException) {
          throw error;
      }
      throw new PaymentProviderException('Unknown Faspay Error', 'UNKNOWN', error);
    }
  }

  async verifySignature(payload: unknown, headers?: Record<string, string | string[] | undefined>): Promise<boolean> {
      // For Faspay, signature is often inside the XML payload itself (payment_notification)
      // payload here is expected to be the RAW XML string or already parsed object?
      // "processWebhook" calls this.

      // If payload is already parsed object:
      let data: any = payload;

      // If raw string (which is likely for XML webhooks), we parse it first?
      // But verifySignature signature usually requires raw or parsed specific fields.
      // Let's assume processWebhook handles parsing and passes the object, OR we parse here.
      // Instruction 09: "processWebhook: Parse XML payload. Verify signature."

      // So here we expect 'payload' to be the Parsed Object containing the signature to verify against?
      // OR we regenerate signature from fields and compare.

      // Let's assume payload is the parsed object adhering to FaspayNotificationSchema roughly
      // verifySignature(userId, password, bill_no, payment_status_code) usually.

      // Implementation:
      // signature = sha1(md5(userId + password) + bill_no + payment_status_code) ??
      // Depends on spec. Instruction just says "Verify signature".
      // Let's use a robust generic logic matching the `generateSignature` utils style or similar.
      // Common Faspay Notif Sig: sha1(md5(userid+pass)+bill_no+payment_status_code)

      // Since we don't have the explicit formula in instructions,
      // I will assume it matches the `generateSignature` logic + status code if available.

      // Safely cast or parse
      const result = FaspayNotificationSchema.safeParse(payload);
      if (!result.success) return false; // Or throw?

      const { bill_no, payment_status_code, signature } = result.data.faspay;

      // Reconstruct signature
      // Assuming pattern: sha1(md5(user+pass) + bill_no + payment_status_code)
      // If generateSignature is only (user, pass, order), we might need a specific one for notif.

      const userPassHash = crypto.createHash('md5').update(this.userId + this.password).digest('hex');
      const expectedSig = crypto.createHash('sha1').update(userPassHash + bill_no + payment_status_code).digest('hex');

      if (expectedSig !== signature) {
           throw new SignatureVerificationException('Invalid Faspay Signature');
      }

      return true;
  }

  async processWebhook(payload: unknown): Promise<PaymentTransaction> {
      // Payload is likely raw XML string from the framework
      let parsedPayload = payload;
      if (typeof payload === 'string') {
          parsedPayload = parseXml(payload);
      }

      // Validate schema
      const validated = FaspayNotificationSchema.parse(parsedPayload);

      // Verify signature
      await this.verifySignature(validated);

      return {
          id: validated.faspay.trx_id,
          referenceId: validated.faspay.bill_no,
          amount: Number(validated.faspay.payment_total),
          currency: 'IDR', // Faspay default
          status: this.mapStatus(validated.faspay.payment_status_code),
          paymentMethod: PaymentMethodType.VIRTUAL_ACCOUNT, // Inferred or generic
          rawResponse: validated.faspay,
          createdAt: new Date(validated.faspay.payment_date || new Date()),
          updatedAt: new Date()
      };
  }

  private mapInputToXml(input: CreatePaymentInput, signature: string): string {
      // Simplified XML construction. In real world, use XMLBuilder.
      return `
      <faspay>
          <request>Post Data Transaction</request>
          <merchant_id>${this.merchantId}</merchant_id>
          <merchant>${this.merchantName}</merchant>
          <bill_no>${input.referenceId}</bill_no>
          <bill_desc>${input.description || 'Payment'}</bill_desc>
          <bill_total>${input.amount}</bill_total>
          <bill_currency>${input.currency}</bill_currency>
          <pay_type>1</pay_type>
          <terminal>10</terminal>
          <cust_name>${input.customer.firstName} ${input.customer.lastName || ''}</cust_name>
          <cust_email>${input.customer.email}</cust_email>
          <signature>${signature}</signature>
          <payment_channel>402</payment_channel>
      </faspay>
      `.trim();
  }

  private mapResponseToTransaction(response: z.infer<typeof FaspayPaymentResponseSchema>, input: CreatePaymentInput): PaymentTransaction {
      const data = response.faspay;
      return {
          id: data.trx_id,
          referenceId: data.bill_no,
          amount: Number(data.bill_total),
          currency: input.currency,
          status: PaymentStatus.PENDING, // Creation usually pending
          paymentMethod: input.paymentMethod,
          rawResponse: data,
          metadata: {
              redirect_url: data.redirect_url
          },
          createdAt: new Date(),
          updatedAt: new Date()
      };
  }

  private mapStatus(code: string): PaymentStatus {
      // Instruction: payment_status_code: '2' -> PAID
      if (code === '2') return PaymentStatus.PAID;
      if (code === '1') return PaymentStatus.PENDING;
      if (code === '7') return PaymentStatus.EXPIRED;
      if (code === '8') return PaymentStatus.FAILED;
      return PaymentStatus.PENDING;
  }
}
