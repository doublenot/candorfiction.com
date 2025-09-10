/**
 * Client-side security utilities for Contact form
 */

// Get form secret from Vite environment variable with fallback
// This secret should match the CONTACT_FORM_SECRET environment variable on the server
const FORM_SECRET =
  import.meta.env.VITE_CONTACT_FORM_SECRET ||
  'candor-fiction-contact-form-secret-2024';

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
  data: {
    name: string;
    email: string;
    service: string;
    message: string;
  },
  timestamp: number,
  nonce: string
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
    encoder.encode(FORM_SECRET),
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
 * Prepare secure form data for submission
 */
export async function prepareSecureFormData(formData: {
  name: string;
  email: string;
  service: string;
  message: string;
}) {
  const timestamp = Date.now();
  const nonce = generateNonce();
  const hmac = await generateHMAC(formData, timestamp, nonce);

  return {
    ...formData,
    timestamp,
    nonce,
    hmac,
  };
}
