import { ITransactionRepository } from '@indopay/contracts';
import { PaymentTransaction } from '@indopay/core';

export class MemoryTransactionRepository implements ITransactionRepository {
  private storage = new Map<string, PaymentTransaction>();

  async create(data: PaymentTransaction): Promise<void> {
    const referenceId = data.referenceId;
    if (!referenceId) {
      throw new Error('referenceId is required');
    }
    this.storage.set(referenceId, data);
    console.log(`[MemoryRepo] Saved transaction: ${referenceId}`);
  }

  async findByReference(referenceId: string): Promise<PaymentTransaction | null> {
    const data = this.storage.get(referenceId);
    console.log(`[MemoryRepo] Found transaction: ${referenceId}`, data ? 'YES' : 'NO');
    return data || null;
  }

  async updateStatus(referenceId: string, status: string, metadata?: Record<string, unknown>): Promise<void> {
    const data = this.storage.get(referenceId);
    if (data) {
      // status is PaymentStatus enum in PaymentTransaction but string in updateStatus signature.
      // Since updateStatus contract defined status as string, we need to cast or map if we want strictness there too.
      // But PaymentTransaction.status is PaymentStatus.
      // Let's assume the string passed is valid or we cast it.
      // Ideally Contract should use PaymentStatus enum too, but Instruction 19 only mentioned create and findByReference types.
      // "Update packages/contracts/src/repository.ts ... Change create ... Change findByReference ..."
      // It didn't explicitly say change updateStatus signature, but for consistency we should handle it.
      // However, data in storage is PaymentTransaction.

      // We need to update the object in storage.
      // Using any cast for status to satisfy the type system if there's a mismatch,
      // or better: just store it.

      const updated = {
          ...data,
          status: status as any, // Cast because PaymentTransaction expects PaymentStatus enum
          metadata: { ...data.metadata, ...metadata }
      };
      this.storage.set(referenceId, updated);
      console.log(`[MemoryRepo] Updated status for ${referenceId} to ${status}`);
    }
  }
}
