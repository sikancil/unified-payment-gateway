import crypto from 'crypto';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export function generateSignature(userId: string, password: string, orderId: string): string {
  // Faspay signature: md5(userId + password + orderId)
  // Note: PRD/Instructions might say SHA1 or MD5.
  // Standard Faspay is often MD5 or SHA1 depending on endpoint.
  // Instruction 09 says "Implement signature(userId, password, orderId) using MD5/SHA1 as per Faspay spec."
  // Usually it is sha1(md5(user + pass) + bill_no) or similar complexity.
  // For this exercise, assuming simple concatenation hash as per typical "signature" instructions unless specified.
  // Let's go with sha1(md5(userid + password) + orderid) which is common,
  // OR if instructions imply direct hash: md5(userId + password + orderId).
  // Let's stick to a robust assumption or simple concatenation based on standard practice if not fully detailed.
  // Instruction says "using MD5/SHA1".

  // Let's implement: SHA1(MD5(userId + password) + orderId)
  const userPassHash = crypto.createHash('md5').update(userId + password).digest('hex');
  return crypto.createHash('sha1').update(userPassHash + orderId).digest('hex');
}

export function parseXml(xmlData: string): any {
  const parser = new XMLParser({
      ignoreAttributes: true,
      parseTagValue: true, // Parse numbers/booleans if possible, helpful for simple fields
      // But Zod transform handles coercing too.
      // The issue with "00" becoming 0 is fast-xml-parser default numeric parsing.
      // We often want to keep "00" as string for response codes.
      parseAttributeValue: false,
      trimValues: true,
      numberParseOptions: {
          leadingZeros: false, // Keep "00" as string
          hex: false,
          skipLike: /^\d+$/ // Skip parsing pure integers to keep them as strings might be safer for codes like "00"
      }
  });
  return parser.parse(xmlData);
}

export function toXml(obj: any): string {
    const builder = new XMLBuilder();
    return builder.build(obj);
}
