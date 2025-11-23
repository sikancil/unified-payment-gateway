import { ITransactionRepository } from '@indopay/contracts';

export class MemoryTransactionRepository implements ITransactionRepository {
  private storage = new Map<string, Record<string, unknown>>();

  async create(data: Record<string, unknown>): Promise<void> {
    const referenceId = data.referenceId as string;
    if (!referenceId) {
      throw new Error('referenceId is required');
    }
    this.storage.set(referenceId, data);
    console.log(`[MemoryRepo] Saved transaction: ${referenceId}`);
  }

  async findByReference(referenceId: string): Promise<Record<string, unknown> | null> {
    const data = this.storage.get(referenceId);
    console.log(`[MemoryRepo] Found transaction: ${referenceId}`, data ? 'YES' : 'NO');
    return data || null;
  }

  async updateStatus(referenceId: string, status: string, metadata?: Record<string, unknown>): Promise<void> {
    const data = this.storage.get(referenceId);
    if (data) {
      this.storage.set(referenceId, { ...data, status, ...metadata });
      console.log(`[MemoryRepo] Updated status for ${referenceId} to ${status}`);
    }
  }
}
