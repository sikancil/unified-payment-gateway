import { z } from 'zod';

export const IpaymuPaymentResponseSchema = z.object({
  Status: z.number(),
  Success: z.boolean(),
  Message: z.string(),
  Data: z.object({
    SessionID: z.string().optional(),
    TransactionID: z.union([z.string(), z.number()]).transform(String).optional(),
    ReferenceId: z.string().optional(),
    Via: z.string().optional(),
    Channel: z.string().optional(),
    PaymentNo: z.string().optional(),
    PaymentName: z.string().optional(),
    Total: z.union([z.string(), z.number()]).transform(Number).optional(),
    Fee: z.number().optional(),
    Expired: z.string().optional(),
    Url: z.string().optional(),
  }).optional(),
}).passthrough();

export const IpaymuWebhookSchema = z.object({
  trx_id: z.string(),
  sid: z.string(),
  status: z.string(), // "berhasil", "pending", etc.
  status_code: z.string().optional(),
  reference_id: z.string(), // This is our Order ID usually
  via: z.string().optional(),
  channel: z.string().optional(),
  va: z.string().optional(), // virtual account number
}).passthrough();

export type IpaymuPaymentResponse = z.infer<typeof IpaymuPaymentResponseSchema>;
export type IpaymuWebhookPayload = z.infer<typeof IpaymuWebhookSchema>;
