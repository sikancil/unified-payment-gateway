import { PaymentTransaction } from '@indopay/core';

export interface ITransactionRepository {
  /**
   * Save a new transaction record.
   */
  create(data: PaymentTransaction): Promise<void>;

  /**
   * Find a transaction by its internal reference ID.
   */
  findByReference(referenceId: string): Promise<PaymentTransaction | null>;

  /**
   * Update the status of a transaction.
   */
  updateStatus(referenceId: string, status: string, metadata?: Record<string, unknown>): Promise<void>;
}
