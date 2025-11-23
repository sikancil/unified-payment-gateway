import { z } from 'zod';

export const FaspayPaymentResponseSchema = z.object({
  faspay: z.object({
    response: z.string(),
    response_code: z.union([z.string(), z.number()]).transform(String),
    trx_id: z.string(),
    bill_no: z.string(),
    bill_total: z.union([z.string(), z.number()]).transform(String),
    redirect_url: z.string().optional(),
    signature: z.string().optional(),
  }).passthrough()
});

export const FaspayNotificationSchema = z.object({
  faspay: z.object({
    request: z.string(),
    trx_id: z.string(),
    bill_no: z.string(),
    payment_status_code: z.union([z.string(), z.number()]).transform(String),
    payment_total: z.union([z.string(), z.number()]).transform(String),
    signature: z.string(),
    payment_date: z.string(),
  }).passthrough()
});

export type FaspayPaymentResponse = z.infer<typeof FaspayPaymentResponseSchema>;
export type FaspayNotification = z.infer<typeof FaspayNotificationSchema>;
