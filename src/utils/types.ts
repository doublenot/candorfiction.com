/**
 * TypeScript interfaces for Cloudflare Worker
 */

export interface Env {
  ASSETS: {
    fetch: (request: RequestInfo, init?: RequestInit) => Promise<Response>;
  };
  ENVIRONMENT: string;
  BREVO_API_KEY?: string;
  RESEND_API_KEY?: string;
  FROM_EMAIL: string; // Sender email address (used by all email services)
  TO_EMAIL: string; // Business email address (used by all email services)
  CONTACT_FORM_SECRET: string; // Secret for HMAC verification
  INSTAGRAM_ACCESS_TOKEN?: string; // Instagram API access token
}

export interface ContactFormData {
  name: string;
  email: string;
  service: string;
  message: string;
}

export interface SecureContactFormData extends ContactFormData {
  timestamp: number;
  nonce: string;
  hmac: string;
}
