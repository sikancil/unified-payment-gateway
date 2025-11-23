Jules, now we implement the "Bridge" interfaces in `packages/contracts`. Refer to `PRD.md` section 3.2.

**Action Required:**
Create the following files in `packages/contracts/src/`:

1.  **`repository.ts`**:
    *   Define `ITransactionRepository`.
    *   Methods: `create`, `findByReference`, `updateStatus`.

2.  **`queue.ts`**:
    *   Define `IJobQueue`.
    *   Method: `add(jobName: string, data: unknown): Promise<void>`.

3.  **`logger.ts`**:
    *   Define `ILogger`.
    *   Methods: `info`, `error`, `warn`, `debug`.

4.  **`index.ts`**:
    *   Export these interfaces.
