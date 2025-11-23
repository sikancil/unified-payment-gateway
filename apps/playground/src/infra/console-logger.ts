import { ILogger } from '@indopay/contracts';

export class ConsoleLogger implements ILogger {
  info(message: string, context?: Record<string, unknown>): void {
    console.log(`[INFO] ${message}`, context ? JSON.stringify(context) : '');
  }
  error(message: string, trace?: unknown, context?: Record<string, unknown>): void {
    console.error(`[ERROR] ${message}`, trace, context ? JSON.stringify(context) : '');
  }
  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(`[WARN] ${message}`, context ? JSON.stringify(context) : '');
  }
  debug(message: string, context?: Record<string, unknown>): void {
    console.debug(`[DEBUG] ${message}`, context ? JSON.stringify(context) : '');
  }
}
