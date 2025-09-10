import type { Env, ContactFormData, SecureContactFormData } from './types';

/**
 * Generate a cryptographically secure nonce
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
}

/**
 * Generate HMAC signature for contact form data
 */
export async function generateHMAC(
  data: ContactFormData,
  timestamp: number,
  nonce: string,
  secret: string
): Promise<string> {
  const message = JSON.stringify({
    name: data.name,
    email: data.email,
    service: data.service,
    message: data.message,
    timestamp,
    nonce,
  });

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(message)
  );
  return Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
}

/**
 * Verify HMAC signature for contact form data
 */
export async function verifyHMAC(
  data: SecureContactFormData,
  secret: string
): Promise<boolean> {
  const expectedHmac = await generateHMAC(
    {
      name: data.name,
      email: data.email,
      service: data.service,
      message: data.message,
    },
    data.timestamp,
    data.nonce,
    secret
  );

  // Use constant-time comparison to prevent timing attacks
  return constantTimeEquals(data.hmac, expectedHmac);
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Validate request timestamp (prevent replay attacks)
 */
export function isValidTimestamp(
  timestamp: number,
  maxAgeMinutes: number = 10
): boolean {
  const now = Date.now();
  const age = now - timestamp;
  const maxAge = maxAgeMinutes * 60 * 1000; // Convert to milliseconds

  // Check if timestamp is not in the future (allow 1 minute clock skew)
  if (timestamp > now + 60000) {
    return false;
  }

  // Check if timestamp is not too old
  return age <= maxAge;
}

/**
 * Validate request origin
 */
export function isValidOrigin(request: Request, env: Env): boolean {
  const origin = request.headers.get('Origin');
  const referer = request.headers.get('Referer');

  // List of allowed origins based on environment
  const allowedOrigins =
    env.ENVIRONMENT === 'production'
      ? ['https://candorfiction.com', 'https://www.candorfiction.com']
      : [
          'https://candorfiction-staging.doublenot.workers.dev',
          'https://staging.candorfiction.com',
          'http://localhost:5173', // Vite dev server
          'http://127.0.0.1:5173',
          'https://localhost:5173',
        ];

  // Check origin header
  if (origin && allowedOrigins.includes(origin)) {
    return true;
  }

  // Fallback to referer header if origin is not present
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
      return allowedOrigins.includes(refererOrigin);
    } catch {
      return false;
    }
  }

  return false;
}
