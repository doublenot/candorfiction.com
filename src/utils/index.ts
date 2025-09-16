/**
 * Utility functions for Cloudflare Worker
 */

export { handleApiRoutes } from './handleApiRoutes';
export { handleContactForm } from './handleContactForm';
export { handleImagesApi } from './handleImagesApi';
export { sendEmail } from './sendEmail';
export { sendEmailViaBrevo } from './sendEmailViaBrevo';
export { sendEmailViaResend } from './sendEmailViaResend';
export {
  getBusinessEmailTemplate,
  getConfirmationEmailTemplate,
} from './emailTemplates';
export {
  fetchInstagramImages,
  instagramCache,
  InstagramImageCache,
} from './instagram';
export { cacheAPI, cache } from './cacheApi';
export { useFetchImages } from './useFetchImages';
export {
  generateNonce,
  generateHMAC,
  verifyHMAC,
  isValidTimestamp,
  isValidOrigin,
} from './security';
export type { Env, ContactFormData, SecureContactFormData } from './types';
