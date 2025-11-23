import { z } from 'zod';

export const XenditInvoiceRequestSchema = z.object({
  external_id: z.string(),
  amount: z.number(),
  payer_email: z.string().email().optional(),
  description: z.string().optional(),
  customer: z.object({
    given_names: z.string().optional(),
    surname: z.string().optional(),
    email: z.string().email().optional(),
    mobile_number: z.string().optional(),
  }).optional(),
  currency: z.string().optional(),
});

export const XenditInvoiceResponseSchema = z.object({
  id: z.string(),
  external_id: z.string(),
  user_id: z.string(),
  status: z.string(),
  merchant_name: z.string(),
  merchant_profile_picture_url: z.string().optional(),
  amount: z.number(),
  payer_email: z.string().optional(),
  description: z.string().optional(),
  invoice_url: z.string(),
  expiry_date: z.string(),
  available_banks: z.array(z.any()).optional(), // Loose typing for now as list is huge
  available_retail_outlets: z.array(z.any()).optional(),
  available_ewallets: z.array(z.any()).optional(),
  available_qr_codes: z.array(z.any()).optional(),
  available_direct_debits: z.array(z.any()).optional(),
  available_paylaters: z.array(z.any()).optional(),
  should_exclude_credit_card: z.boolean().optional(),
  should_send_email: z.boolean().optional(),
  created: z.string(),
  updated: z.string(),
  currency: z.string(),
}).passthrough();

export const XenditWebhookSchema = z.object({
  id: z.string(),
  external_id: z.string(),
  user_id: z.string(),
  is_high: z.boolean().optional(),
  payment_method: z.string().optional(),
  status: z.string(),
  merchant_name: z.string(),
  amount: z.number(),
  paid_amount: z.number().optional(),
  bank_code: z.string().optional(),
  paid_at: z.string().optional(),
  payer_email: z.string().optional(),
  description: z.string().optional(),
  adjusted_received_amount: z.number().optional(),
  fees_paid_amount: z.number().optional(),
  updated: z.string(),
  created: z.string(),
  currency: z.string(),
  payment_channel: z.string().optional(),
  payment_destination: z.string().optional(),
}).passthrough();

export type XenditInvoiceRequest = z.infer<typeof XenditInvoiceRequestSchema>;
export type XenditInvoiceResponse = z.infer<typeof XenditInvoiceResponseSchema>;
export type XenditWebhookPayload = z.infer<typeof XenditWebhookSchema>;
