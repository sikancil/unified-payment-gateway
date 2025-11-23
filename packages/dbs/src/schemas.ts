import { z } from 'zod';

export const DbsPaymentResponseSchema = z.object({
  header: z.object({
    msgId: z.string(),
    orgId: z.string(),
    timeStamp: z.string(),
    ctry: z.string(),
  }),
  txnInfo: z.object({
    txnType: z.string(),
    customerReference: z.string(),
    txnRefId: z.string(),
    txnDate: z.string(),
    txnAmount: z.string(),
    txnCcy: z.string(),
    txnStatus: z.string(),
    txnStatusDescription: z.string().optional(),
  }),
}).passthrough();

export type DbsPaymentResponse = z.infer<typeof DbsPaymentResponseSchema>;
