/**
 * TypeScript interfaces for Cloudflare Worker
 */

export interface Env {
  ASSETS: {
    fetch: (request: RequestInfo, init?: RequestInit) => Promise<Response>;
  };
  ENVIRONMENT: string;
  BREVO_API_KEY: string;
  BREVO_FROM_EMAIL: string;
  BREVO_TO_EMAIL: string;
  CONTACT_FORM_SECRET: string; // Secret for HMAC verification
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
