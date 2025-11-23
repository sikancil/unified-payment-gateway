export class IndoPayError extends Error {
  public readonly code: string;
  public readonly originalError?: unknown;

  constructor(message: string, code: string, originalError?: unknown) {
    super(message);
    this.name = 'IndoPayError';
    this.code = code;
    this.originalError = originalError;
    Object.setPrototypeOf(this, IndoPayError.prototype);
  }
}

export class ValidationError extends IndoPayError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'VALIDATION_ERROR', originalError);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class PaymentProviderException extends IndoPayError {
  constructor(message: string, code: string = 'PROVIDER_ERROR', originalError?: unknown) {
    super(message, code, originalError);
    this.name = 'PaymentProviderException';
    Object.setPrototypeOf(this, PaymentProviderException.prototype);
  }
}

export class AuthenticationException extends IndoPayError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'AUTHENTICATION_ERROR', originalError);
    this.name = 'AuthenticationException';
    Object.setPrototypeOf(this, AuthenticationException.prototype);
  }
}

export class SignatureVerificationException extends IndoPayError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'SIGNATURE_VERIFICATION_ERROR', originalError);
    this.name = 'SignatureVerificationException';
    Object.setPrototypeOf(this, SignatureVerificationException.prototype);
  }
}
