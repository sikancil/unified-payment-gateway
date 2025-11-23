import crypto from 'crypto';

export function generateDigest(body: string): string {
  // Digest = Base64(SHA256(Body))
  const hash = crypto.createHash('sha256').update(body).digest('base64');
  return hash;
}

export function generateSignature(
  clientId: string,
  requestId: string,
  timestamp: string,
  requestTarget: string,
  digest: string,
  secretKey: string
): string {
  // Format:
  // Client-Id: ...\n
  // Request-Id: ...\n
  // Request-Timestamp: ...\n
  // Request-Target: ...\n
  // Digest: ...
  // (Assuming NO body for GET, but we are doing POST so digest is present)
  // According to Doku Jokul Docs:
  // Component Signature = "Client-Id:" + ClientId + "\n" +
  //                       "Request-Id:" + RequestId + "\n" +
  //                       "Request-Timestamp:" + Timestamp + "\n" +
  //                       "Request-Target:" + RequestTarget + "\n" +
  //                       "Digest:" + Digest

  // If Digest is empty (e.g. GET), it might be handled differently,
  // but for createPayment we have a body.

  const signatureComponent =
    `Client-Id:${clientId}\n` +
    `Request-Id:${requestId}\n` +
    `Request-Timestamp:${timestamp}\n` +
    `Request-Target:${requestTarget}\n` +
    `Digest:${digest}`;

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(signatureComponent)
    .digest('base64');

  return `HMACSHA256=${signature}`;
}
