import type { Env, ContactFormData } from './types';
import {
  getBusinessEmailTemplate,
  getConfirmationEmailTemplate,
} from './emailTemplates';

/**
 * Send email via Brevo API
 */
export async function sendEmailViaBrevo(
  formData: ContactFormData,
  env: Env
): Promise<boolean> {
  if (!env.BREVO_API_KEY || !env.FROM_EMAIL || !env.TO_EMAIL) {
    console.warn('Brevo configuration missing - email not sent');
    return false;
  }

  // Get email templates
  const businessTemplate = getBusinessEmailTemplate(formData);
  const confirmationTemplate = getConfirmationEmailTemplate(formData);

  // Business notification email structure following Brevo SDK pattern
  const emailData = {
    subject: businessTemplate.subject,
    htmlContent: businessTemplate.html,
    textContent: businessTemplate.text,
    sender: {
      name: 'Candor Fiction Website',
      email: env.FROM_EMAIL,
    },
    to: [
      {
        email: env.TO_EMAIL,
        name: 'Candor Fiction',
      },
    ],
    replyTo: {
      email: formData.email,
      name: formData.name,
    },
    headers: {
      'X-Mailer': 'Candor Fiction Contact Form',
      'X-Priority': '3',
      'X-Contact-Form-Source': 'website',
    },
    params: {
      customerName: formData.name,
      customerEmail: formData.email,
      serviceType: formData.service,
      submissionDate: new Date().toLocaleString(),
    },
  };

  // Customer confirmation email structure following Brevo SDK pattern
  const confirmationEmailData = {
    subject: confirmationTemplate.subject,
    htmlContent: confirmationTemplate.html,
    textContent: confirmationTemplate.text,
    sender: {
      name: 'Candor Fiction',
      email: env.FROM_EMAIL,
    },
    to: [
      {
        email: formData.email,
        name: formData.name,
      },
    ],
    replyTo: {
      email: env.TO_EMAIL,
      name: 'Candor Fiction Support',
    },
    headers: {
      'X-Mailer': 'Candor Fiction Contact Form',
      'X-Priority': '3',
      'X-Auto-Response-Suppress': 'OOF, AutoReply',
      'X-Contact-Confirmation': 'true',
    },
    params: {
      customerName: formData.name,
      serviceType: formData.service,
      responseTime: '24 hours',
      companyTagline: "It's All About the Story",
    },
  };

  try {
    // Send notification email to business (following Brevo SDK pattern)
    const businessEmailResponse = await fetch(
      'https://api.brevo.com/v3/smtp/email',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': env.BREVO_API_KEY,
        },
        body: JSON.stringify(emailData),
      }
    );

    if (!businessEmailResponse.ok) {
      const errorData = await businessEmailResponse.text();
      console.error(
        'Brevo business email API error:',
        businessEmailResponse.status,
        errorData
      );
      return false;
    }

    const businessEmailResult = await businessEmailResponse.json();
    console.log(
      'Business email sent successfully:',
      businessEmailResult.messageId
    );

    // Send confirmation email to customer
    const confirmationEmailResponse = await fetch(
      'https://api.brevo.com/v3/smtp/email',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': env.BREVO_API_KEY,
        },
        body: JSON.stringify(confirmationEmailData),
      }
    );

    if (!confirmationEmailResponse.ok) {
      const errorData = await confirmationEmailResponse.text();
      console.error(
        'Brevo confirmation email API error:',
        confirmationEmailResponse.status,
        errorData
      );
      // Don't return false here - business email was sent successfully
    } else {
      const confirmationEmailResult = await confirmationEmailResponse.json();
      console.log(
        'Confirmation email sent successfully:',
        confirmationEmailResult.messageId
      );
    }

    console.log('Brevo API called successfully - emails dispatched');
    return true;
  } catch (error) {
    console.error('Brevo API error:', error);
    return false;
  }
}
