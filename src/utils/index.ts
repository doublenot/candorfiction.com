/**
 * Utility functions for Cloudflare Worker
 */

export { handleApiRoutes } from './handleApiRoutes';
export { handleContactForm } from './handleContactForm';
export { sendEmail } from './sendEmail';
export { sendEmailViaBrevo } from './sendEmailViaBrevo';
export { sendEmailViaResend } from './sendEmailViaResend';
export {
  getBusinessEmailTemplate,
  getConfirmationEmailTemplate,
} from './emailTemplates';
export {
  generateNonce,
  generateHMAC,
  verifyHMAC,
  isValidTimestamp,
  isValidOrigin,
} from './security';
export type { Env, ContactFormData, SecureContactFormData } from './types';
