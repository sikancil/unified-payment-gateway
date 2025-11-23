export enum PaymentMethodType {
  VIRTUAL_ACCOUNT = 'VIRTUAL_ACCOUNT',
  CREDIT_CARD = 'CREDIT_CARD',
  EWALLET = 'EWALLET',
  QRIS = 'QRIS',
  RETAIL_OUTLET = 'RETAIL_OUTLET',
  DIRECT_DEBIT = 'DIRECT_DEBIT'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED'
}

export interface CustomerDetails {
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
}

export interface CreatePaymentInput {
  amount: number;
  currency: string;
  referenceId: string;
  paymentMethod: PaymentMethodType;
  customer: CustomerDetails;
  metadata?: Record<string, unknown>;
  description?: string;
}

export interface PaymentTransaction {
  id: string; // The ID from the provider (e.g. order_id, charge_id)
  referenceId: string; // Internal reference ID
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethodType;
  metadata?: Record<string, unknown>;
  rawResponse: Record<string, unknown>; // Store original provider response
  createdAt: Date;
  updatedAt: Date;
}
