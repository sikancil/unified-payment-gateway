import { z } from 'zod';

export const MidtransChargeSchema = z.object({
  payment_type: z.string(),
  transaction_details: z.object({
    order_id: z.string(),
    gross_amount: z.number(),
  }),
  customer_details: z.object({
    first_name: z.string(),
    last_name: z.string().optional(),
    email: z.string(),
    phone: z.string().optional(),
  }),
  credit_card: z.object({
    secure: z.boolean(),
  }).optional(),
  bank_transfer: z.object({
    bank: z.string(),
  }).optional(),
});

export const MidtransResponseSchema = z.object({
  transaction_id: z.string(),
  order_id: z.string(),
  gross_amount: z.string(), // Midtrans returns this as string usually
  currency: z.string().optional(),
  transaction_status: z.string(),
  payment_type: z.string(),
  transaction_time: z.string(),
  status_code: z.string(),
  status_message: z.string(),
}).passthrough(); // Allow extra fields

export const MidtransWebhookSchema = z.object({
  transaction_id: z.string(),
  order_id: z.string(),
  gross_amount: z.string(),
  currency: z.string().optional(),
  transaction_status: z.string(),
  payment_type: z.string(),
  transaction_time: z.string(),
  status_code: z.string(),
  signature_key: z.string(),
  fraud_status: z.string().optional(),
}).passthrough();

export type MidtransChargePayload = z.infer<typeof MidtransChargeSchema>;
export type MidtransResponse = z.infer<typeof MidtransResponseSchema>;
export type MidtransWebhookPayload = z.infer<typeof MidtransWebhookSchema>;
