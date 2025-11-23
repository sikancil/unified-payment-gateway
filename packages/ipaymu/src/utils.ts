import crypto from 'crypto';

export function generateSignature(body: string, method: string, va: string, secretKey: string): string {
  // Signature = HMAC-SHA256(stringToSign, secretKey)
  // StringToSign = METHOD:VA:BODY:SECRET
  // Where BODY is JSON.stringify(body) or empty string if GET
  // NOTE: iPaymu documentation says:
  // signature = hash_hmac('sha256', 'POST:' . $va . ':' . $body_json . ':' . $secret, $secret);

  const stringToSign = `${method.toUpperCase()}:${va}:${body}:${secretKey}`;
  return crypto.createHmac('sha256', secretKey).update(stringToSign).digest('hex');
}
