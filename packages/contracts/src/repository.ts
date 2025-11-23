// We use 'unknown' or specific types from @indopay/core if we were to import them.
// But Contracts usually define the Host App's responsibility.
// For now, we will use loose typing for the entity to avoid circular deps or tight coupling,
// or we assume the Host App handles the persistence mapping.

export interface ITransactionRepository {
  /**
   * Save a new transaction record.
   */
  create(data: Record<string, unknown>): Promise<void>;

  /**
   * Find a transaction by its internal reference ID.
   */
  findByReference(referenceId: string): Promise<Record<string, unknown> | null>;

  /**
   * Update the status of a transaction.
   */
  updateStatus(referenceId: string, status: string, metadata?: Record<string, unknown>): Promise<void>;
}
