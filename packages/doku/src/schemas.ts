import { z } from 'zod';

export const DokuPaymentResponseSchema = z.object({
  order: z.object({
    invoice_number: z.string(),
    amount: z.number().or(z.string()), // Doku might return string sometimes
  }),
  virtual_account_info: z.object({
    virtual_account_number: z.string(),
    how_to_pay_page: z.string().optional(),
    how_to_pay_api: z.string().optional(),
  }).optional(),
  payment: z.object({
    payment_due_date: z.string().optional(),
  }).optional(),
}).passthrough();

export const DokuWebhookSchema = z.object({
  service: z.object({
    id: z.string(),
  }),
  acquirer: z.object({
    id: z.string(),
  }),
  channel: z.object({
    id: z.string(),
  }),
  order: z.object({
    invoice_number: z.string(),
    amount: z.number().or(z.string()),
  }),
  transaction: z.object({
    status: z.string(),
    date: z.string(),
    original_request_id: z.string(),
  }),
}).passthrough();

export type DokuPaymentResponse = z.infer<typeof DokuPaymentResponseSchema>;
export type DokuWebhookPayload = z.infer<typeof DokuWebhookSchema>;
