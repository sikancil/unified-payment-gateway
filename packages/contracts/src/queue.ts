export interface IJobQueue {
  /**
   * Add a job to the queue for background processing.
   */
  add(jobName: string, data: unknown): Promise<void>;
}
