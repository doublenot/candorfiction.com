import type { ContactFormData } from './types';

/**
 * Email template configurations for different providers
 */

export interface BusinessEmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface ConfirmationEmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Generate business notification email template
 */
export function getBusinessEmailTemplate(
  formData: ContactFormData
): BusinessEmailTemplate {
  const subject = `New Contact Form Submission from ${formData.name}`;

  const html = `
    <html>
      <body>
        <h1>New Contact Form Submission</h1>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Contact Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Name:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${
                formData.name
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Email:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <a href="mailto:${formData.email}">${formData.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Service Interest:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${
                formData.service
              }</td>
            </tr>
          </table>
          
          <h3 style="color: #333;">Message:</h3>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #007cba; margin-bottom: 20px;">
            <p style="margin: 0; line-height: 1.6;">${formData.message.replace(
              /\n/g,
              '<br>'
            )}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">
            <strong>Submitted on:</strong> ${new Date().toLocaleString()}<br>
            <strong>Source:</strong> Candor Fiction Website Contact Form
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
New Contact Form Submission

=== Contact Details ===
Name: ${formData.name}
Email: ${formData.email}
Service Interest: ${formData.service}

=== Message ===
${formData.message}

=== Submission Info ===
Submitted on: ${new Date().toLocaleString()}
Source: Candor Fiction Website Contact Form
  `.trim();

  return { subject, html, text };
}

/**
 * Generate customer confirmation email template
 */
export function getConfirmationEmailTemplate(
  formData: ContactFormData
): ConfirmationEmailTemplate {
  const subject = 'Thank you for contacting Candor Fiction';

  const html = `
    <html>
      <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #007cba; margin-bottom: 10px;">Thank you for your message!</h1>
            <p style="color: #666; font-size: 16px;">We appreciate you reaching out to Candor Fiction</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <p style="margin: 0 0 15px 0; font-size: 16px;">Dear <strong>${
              formData.name
            }</strong>,</p>
            <p style="margin: 0 0 15px 0; line-height: 1.6;">
              We've received your inquiry about our <strong>${
                formData.service
              }</strong> services 
              and will get back to you within <strong>24 hours</strong>.
            </p>
            <p style="margin: 0; line-height: 1.6;">
              Our team is excited to help bring your story to life!
            </p>
          </div>
          
          <div style="border-left: 4px solid #007cba; padding-left: 20px; margin-bottom: 25px;">
            <h3 style="color: #333; margin: 0 0 10px 0;">Your Message:</h3>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              <p style="margin: 0; line-height: 1.6; color: #555;">${formData.message.replace(
                /\n/g,
                '<br>'
              )}</p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background-color: #007cba; border-radius: 8px; color: white;">
            <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">Best regards,</p>
            <p style="margin: 0 0 5px 0;">The Candor Fiction Team</p>
            <p style="margin: 0; font-style: italic; opacity: 0.9;">It's All About the Story</p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 12px; color: #999;">
              This is an automated confirmation. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Thank you for contacting Candor Fiction!

Dear ${formData.name},

We've received your inquiry about our ${formData.service} services and will get back to you within 24 hours.

Our team is excited to help bring your story to life!

=== Your Message ===
${formData.message}

=== 
Best regards,
The Candor Fiction Team
It's All About the Story

---
This is an automated confirmation. Please do not reply to this email.
  `.trim();

  return { subject, html, text };
}
