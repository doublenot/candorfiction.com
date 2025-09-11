import { sendEmailViaBrevo } from './sendEmailViaBrevo';
import { sendEmailViaResend } from './sendEmailViaResend';
import type { Env, ContactFormData } from './types';

/**
 * Send email using available email service (Brevo first, then Resend fallback)
 */
export async function sendEmail(
  formData: ContactFormData,
  env: Env
): Promise<boolean> {
  // Validate required email configuration
  if (!env.FROM_EMAIL || !env.TO_EMAIL) {
    console.warn(
      'Email configuration missing - FROM_EMAIL and TO_EMAIL are required'
    );
    return false;
  }

  // Check Brevo configuration first (priority service)
  if (env.BREVO_API_KEY) {
    console.log('Using Brevo email service');
    try {
      const result = await sendEmailViaBrevo(formData, env);
      if (result) {
        return true;
      }
      console.warn('Brevo email failed, trying Resend fallback');
    } catch (error) {
      console.error('Brevo email error:', error);
      console.log('Falling back to Resend email service');
    }
  }
  // Check Resend configuration as fallback
  else if (env.RESEND_API_KEY) {
    console.log('Using Resend email service');
    try {
      return await sendEmailViaResend(formData, env);
    } catch (error) {
      console.error('Resend email error:', error);
      return false;
    }
  }

  // No email service configured
  console.warn(
    'No email service configured - neither Brevo nor Resend API key found'
  );
  return false;
}
