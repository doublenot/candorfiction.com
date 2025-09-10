import { sendEmailViaBrevo } from './sendEmailViaBrevo';
import { verifyHMAC, isValidTimestamp, isValidOrigin } from './security';
import type { Env, ContactFormData, SecureContactFormData } from './types';

/**
 * Handle contact form submission with security validation
 */
export async function handleContactForm(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Validate origin first
    if (!isValidOrigin(request, env)) {
      console.warn('Contact form submission rejected: invalid origin', {
        origin: request.headers.get('Origin'),
        referer: request.headers.get('Referer'),
        userAgent: request.headers.get('User-Agent'),
        timestamp: new Date().toISOString(),
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Request not authorized',
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': request.headers.get('Origin') || '',
          },
        }
      );
    }

    // Check if CONTACT_FORM_SECRET is configured
    if (!env.CONTACT_FORM_SECRET) {
      console.error('CONTACT_FORM_SECRET not configured');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Server configuration error',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': request.headers.get('Origin') || '',
          },
        }
      );
    }

    // Parse form data
    const secureFormData: SecureContactFormData = await request.json();

    // Validate required fields
    if (
      !secureFormData.name ||
      !secureFormData.email ||
      !secureFormData.service ||
      !secureFormData.message ||
      !secureFormData.timestamp ||
      !secureFormData.nonce ||
      !secureFormData.hmac
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'All fields are required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': request.headers.get('Origin') || '',
          },
        }
      );
    }

    // Validate timestamp (prevent replay attacks)
    if (!isValidTimestamp(secureFormData.timestamp, 10)) {
      console.warn('Contact form submission rejected: invalid timestamp', {
        timestamp: secureFormData.timestamp,
        now: Date.now(),
        age: Date.now() - secureFormData.timestamp,
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Request expired. Please try again.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': request.headers.get('Origin') || '',
          },
        }
      );
    }

    // Verify HMAC signature
    const isValidHmac = await verifyHMAC(
      secureFormData,
      env.CONTACT_FORM_SECRET
    );
    if (!isValidHmac) {
      console.warn('Contact form submission rejected: invalid HMAC', {
        nonce: secureFormData.nonce,
        timestamp: secureFormData.timestamp,
        email: secureFormData.email,
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid request signature',
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': request.headers.get('Origin') || '',
          },
        }
      );
    }

    // Extract basic form data for processing
    const formData: ContactFormData = {
      name: secureFormData.name,
      email: secureFormData.email,
      service: secureFormData.service,
      message: secureFormData.message,
    };

    // Additional validation checks - ensure all fields are present and not empty
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.service.trim() ||
      !formData.message.trim()
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'All fields are required and cannot be empty',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': request.headers.get('Origin') || '',
          },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Please enter a valid email address',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': request.headers.get('Origin') || '',
          },
        }
      );
    }

    // Log the form submission (in production, you might want to send to a service)
    console.log('Contact form submission:', {
      name: formData.name,
      email: formData.email,
      service: formData.service,
      message: formData.message.substring(0, 100) + '...', // Truncate for logging
      timestamp: new Date().toISOString(),
      environment: env.ENVIRONMENT,
    });

    // Send email via Brevo API
    try {
      const emailSent = await sendEmailViaBrevo(formData, env);

      if (!emailSent) {
        console.error('Failed to send email via Brevo');
        // Continue anyway - we don't want to fail the form submission if email fails
      }
    } catch (emailError) {
      console.error('Brevo email error:', emailError);
      // Continue anyway - we don't want to fail the form submission if email fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': request.headers.get('Origin') || '',
        },
      }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'There was an error processing your request. Please try again.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': request.headers.get('Origin') || '',
        },
      }
    );
  }
}
