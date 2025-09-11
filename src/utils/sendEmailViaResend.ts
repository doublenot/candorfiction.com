import type { Env, ContactFormData } from './types';
import {
  getBusinessEmailTemplate,
  getConfirmationEmailTemplate,
} from './emailTemplates';

/**
 * Send email via Resend API
 */
export async function sendEmailViaResend(
  formData: ContactFormData,
  env: Env
): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.FROM_EMAIL || !env.TO_EMAIL) {
    console.warn('Resend configuration missing - email not sent');
    return false;
  }

  // Get email templates
  const businessTemplate = getBusinessEmailTemplate(formData);
  const confirmationTemplate = getConfirmationEmailTemplate(formData);

  // Business notification email structure following Resend API pattern
  const emailData = {
    from: `Candor Fiction Website <${env.FROM_EMAIL}>`,
    to: [env.TO_EMAIL],
    subject: businessTemplate.subject,
    html: businessTemplate.html,
    text: businessTemplate.text,
    reply_to: `${formData.name} <${formData.email}>`,
    headers: {
      'X-Mailer': 'Candor Fiction Contact Form',
      'X-Priority': '3',
      'X-Contact-Form-Source': 'website',
    },
    tags: [
      {
        name: 'type',
        value: 'contact-form',
      },
      {
        name: 'service',
        value: formData.service.toLowerCase().replace(/\s+/g, '-'),
      },
      {
        name: 'source',
        value: 'website',
      },
    ],
  };

  // Customer confirmation email structure following Resend API pattern
  const confirmationEmailData = {
    from: `Candor Fiction <${env.FROM_EMAIL}>`,
    to: [formData.email],
    subject: confirmationTemplate.subject,
    html: confirmationTemplate.html,
    text: confirmationTemplate.text,
    reply_to: `Candor Fiction Support <${env.TO_EMAIL}>`,
    headers: {
      'X-Mailer': 'Candor Fiction Contact Form',
      'X-Priority': '3',
      'X-Auto-Response-Suppress': 'OOF, AutoReply',
      'X-Contact-Confirmation': 'true',
    },
    tags: [
      {
        name: 'type',
        value: 'confirmation',
      },
      {
        name: 'service',
        value: formData.service.toLowerCase().replace(/\s+/g, '-'),
      },
      {
        name: 'auto-response',
        value: 'true',
      },
    ],
  };

  try {
    // Send notification email to business (following Resend API pattern)
    const businessEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!businessEmailResponse.ok) {
      const errorData = await businessEmailResponse.text();
      console.error(
        'Resend business email API error:',
        businessEmailResponse.status,
        errorData
      );
      return false;
    }

    const businessEmailResult = await businessEmailResponse.json();
    console.log('Business email sent successfully:', businessEmailResult.id);

    // Send confirmation email to customer
    const confirmationEmailResponse = await fetch(
      'https://api.resend.com/emails',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(confirmationEmailData),
      }
    );

    if (!confirmationEmailResponse.ok) {
      const errorData = await confirmationEmailResponse.text();
      console.error(
        'Resend confirmation email API error:',
        confirmationEmailResponse.status,
        errorData
      );
      // Don't return false here - business email was sent successfully
    } else {
      const confirmationEmailResult = await confirmationEmailResponse.json();
      console.log(
        'Confirmation email sent successfully:',
        confirmationEmailResult.id
      );
    }

    console.log('Resend API called successfully - emails dispatched');
    return true;
  } catch (error) {
    console.error('Resend API error:', error);
    return false;
  }
}
