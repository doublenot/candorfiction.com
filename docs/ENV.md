# Environment Variables

This document outlines all environment variables used in the Candor Fiction website project, built with Cloudflare Workers.

## 📋 Overview

Environment variables are configured in the `wrangler.toml` file and passed to the Cloudflare Worker at runtime. They control deployment environments, email integration, and asset handling.

## 🌍 Environment Variables

### Core Variables

#### `ENVIRONMENT`

- **Type**: `string`
- **Required**: Yes
- **Description**: Specifies the deployment environment
- **Values**:
  - `"staging"` - Development/testing environment
  - `"production"` - Live production environment
- **Usage**: Used for logging and environment-specific behavior
- **Configured in**: `wrangler.toml` under `[vars]` and environment-specific sections

#### `ASSETS`

- **Type**: `any` (Cloudflare Assets binding)
- **Required**: Yes (automatically provided by Cloudflare)
- **Description**: Cloudflare Workers binding for serving static assets
- **Usage**: Serves built React application files, CSS, JS, images, and other static content
- **Configured in**: Automatically bound by Cloudflare Workers based on `[assets]` configuration

### Email Integration

The contact form supports two email services with automatic fallback. **Brevo is checked first**, and if not configured, the system falls back to **Resend**. Both services use the same shared email configuration.

#### `BREVO_API_KEY` (Optional)

- **Type**: `string`
- **Required**: No (but recommended for primary email service)
- **Description**: API key for Brevo (formerly Sendinblue) email service
- **Usage**: Authenticates requests to Brevo API for sending emails
- **Security**: Sensitive - store as encrypted secret in Cloudflare dashboard
- **Example**: `"xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`

#### `RESEND_API_KEY` (Optional)

- **Type**: `string`
- **Required**: No (fallback email service)
- **Description**: API key for Resend email service
- **Usage**: Authenticates requests to Resend API for sending emails (used if Brevo is not configured)
- **Security**: Sensitive - store as encrypted secret in Cloudflare dashboard
- **Example**: `"re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`

#### `FROM_EMAIL` (Required)

- **Type**: `string` (email address)
- **Required**: Yes (for any email functionality)
- **Description**: The "from" email address for outgoing emails (used by both Brevo and Resend)
- **Usage**:
  - Business notification emails (from website to business)
  - Customer confirmation emails (from business to customer)
- **Requirements**: Must be a verified sender in your chosen email service account
- **Example**: `"noreply@candorfiction.com"`

#### `TO_EMAIL` (Required)

- **Type**: `string` (email address)
- **Required**: Yes (for any email functionality)
- **Description**: The business email address to receive contact form submissions
- **Usage**: Receives notification emails when users submit the contact form
- **Example**: `"info@candorfiction.com"`

### Security Variables

#### `CONTACT_FORM_SECRET`

- **Type**: `string`
- **Required**: Yes (for contact form security)
- **Description**: Secret key for HMAC signature verification of contact form submissions
- **Usage**: Validates that contact form requests are legitimate and prevents unauthorized API access
- **Security**: Highly sensitive - must be stored as encrypted secret
- **Requirements**: Should be a strong, random string (minimum 32 characters)
- **Example**: `"candor-fiction-contact-form-secret-2024-random-string-here"`

#### `VITE_CONTACT_FORM_SECRET`

- **Type**: `string`
- **Required**: Yes (for client-side HMAC generation)
- **Description**: Client-side version of contact form secret for HMAC signature generation
- **Usage**: Must match server-side `CONTACT_FORM_SECRET` for signature verification to work
- **Security**: Exposed to client-side code, used for HMAC authenticity (not access control)
- **Configuration**: Set in `.env.local` file or build environment
- **Example**: `"candor-fiction-contact-form-secret-2024-random-string-here"`

## 🔧 Configuration

### wrangler.toml Structure

```toml
[vars]
ENVIRONMENT = "production"

[env.staging]
name = "candorfiction-staging"
vars = { ENVIRONMENT = "staging" }

[env.production]
name = "candorfiction-production"
vars = { ENVIRONMENT = "production" }
```

### Setting Sensitive Variables

For security reasons, sensitive variables like API keys and email addresses should be set as encrypted secrets rather than plain text in `wrangler.toml`.

#### Using Wrangler CLI

```bash
# Set secrets for production

# Email configuration (always required)
wrangler secret put FROM_EMAIL --env production
wrangler secret put TO_EMAIL --env production

# Email service API keys (choose one or both)
wrangler secret put BREVO_API_KEY --env production    # Primary service
wrangler secret put RESEND_API_KEY --env production   # Fallback service

# Security secret (always required)
wrangler secret put CONTACT_FORM_SECRET --env production

# Set secrets for staging
wrangler secret put FROM_EMAIL --env staging
wrangler secret put TO_EMAIL --env staging
wrangler secret put BREVO_API_KEY --env staging
wrangler secret put RESEND_API_KEY --env staging
wrangler secret put CONTACT_FORM_SECRET --env staging
```

#### Using Cloudflare Dashboard

1. Go to Workers & Pages → Your Worker → Settings
2. Navigate to "Variables and Secrets"
3. Add each variable as an "Encrypted" secret

### Client-Side Environment Setup

For the React application to generate HMAC signatures, you need to set the client-side environment variable:

#### Local Development:

Create a `.env.local` file in the project root:

```bash
VITE_CONTACT_FORM_SECRET=your-secret-here
```

#### Production/Staging Deployment:

Set the environment variable in your CI/CD pipeline or hosting platform:

```bash
# GitHub Actions example
VITE_CONTACT_FORM_SECRET=${{ secrets.CONTACT_FORM_SECRET }}

# Manual deployment
export VITE_CONTACT_FORM_SECRET="your-secret-here"
npm run build
```

**Important**: The `VITE_CONTACT_FORM_SECRET` value must match the server-side `CONTACT_FORM_SECRET` for HMAC verification to work.

## 🏗️ Environment-Specific Deployment

### Staging Environment

```bash
# Deploy to staging
wrangler deploy --env staging
```

- Uses `ENVIRONMENT = "staging"`
- Deployed to `candorfiction-staging` worker
- Available at staging domain

### Production Environment

```bash
# Deploy to production
wrangler deploy --env production
```

- Uses `ENVIRONMENT = "production"`
- Deployed to `candorfiction-production` worker
- Available at production domain

## 📧 Email Functionality

The contact form supports **dual email service configuration** with automatic failover using shared email addresses:

1. **Primary Service**: Brevo (checked first)
2. **Fallback Service**: Resend (used if Brevo is not configured or fails)

### Email Service Priority

The system checks email services in this order:

1. **Brevo** - If `BREVO_API_KEY` is configured (uses shared `FROM_EMAIL` and `TO_EMAIL`)
2. **Resend** - If Brevo is not configured or fails, and `RESEND_API_KEY` is configured (uses shared `FROM_EMAIL` and `TO_EMAIL`)

### Configuration Options

- **Brevo Only**: Configure `BREVO_API_KEY` + shared email addresses
- **Resend Only**: Configure `RESEND_API_KEY` + shared email addresses
- **Both Services**: Configure both API keys for automatic failover (Brevo → Resend)
- **No Email**: Contact form will work but no emails will be sent (not recommended)

### Email Flow

1. User submits contact form
2. System sends notification email to business (`TO_EMAIL`)
3. System sends confirmation email to user's email address
4. Both emails are sent from the configured sender address (`FROM_EMAIL`)

## 🔍 Usage in Code

### TypeScript Interface

Environment variables are typed in `src/utils/types.ts`:

```typescript
export interface Env {
  ASSETS: any; // Cloudflare Assets binding
  ENVIRONMENT: string; // Deployment environment
  BREVO_API_KEY?: string; // Brevo API authentication (optional)
  RESEND_API_KEY?: string; // Resend API authentication (optional)
  FROM_EMAIL: string; // Sender email address (used by all email services)
  TO_EMAIL: string; // Business email address (used by all email services)
  CONTACT_FORM_SECRET: string; // Security secret for HMAC verification (required)
}
```

### Function Usage

- **`src/worker.ts`**: Uses `ASSETS` for static file serving and `ENVIRONMENT` for logging
- **`src/utils/handleContactForm.ts`**: Uses `ENVIRONMENT` for logging, `CONTACT_FORM_SECRET` for HMAC verification, and calls unified email service
- **`src/utils/sendEmail.ts`**: Manages email service selection (Brevo first, Resend fallback) using shared email addresses
- **`src/utils/sendEmailViaBrevo.ts`**: Uses `BREVO_API_KEY` for authentication and shared `FROM_EMAIL`/`TO_EMAIL` for email functionality
- **`src/utils/sendEmailViaResend.ts`**: Uses `RESEND_API_KEY` for authentication and shared `FROM_EMAIL`/`TO_EMAIL` for email functionality
- **`src/utils/emailTemplates.ts`**: Provides shared email templates for both services
- **`src/utils/security.ts`**: Uses `CONTACT_FORM_SECRET` for server-side HMAC validation and origin checking

## ✅ Validation

The system includes validation for missing environment variables:

```typescript
// Email configuration validation
if (!env.FROM_EMAIL || !env.TO_EMAIL) {
  console.warn(
    'Email configuration missing - FROM_EMAIL and TO_EMAIL are required'
  );
  return false;
}

// Email service selection - Brevo checked first
if (env.BREVO_API_KEY) {
  console.log('Using Brevo email service');
  // ... attempt Brevo email
}

// Resend fallback
if (env.RESEND_API_KEY) {
  console.log('Using Resend email service');
  // ... attempt Resend email
}

// No email service configured
console.warn(
  'No email service configured - neither Brevo nor Resend credentials found'
);

// Contact form security validation
if (!env.CONTACT_FORM_SECRET) {
  console.error('CONTACT_FORM_SECRET not configured');
  return new Response('Server configuration error', { status: 500 });
}
```

## 🚨 Security Best Practices

1. **Never commit sensitive values** to version control
2. **Use encrypted secrets** for API keys and email addresses
3. **Rotate API keys regularly**
4. **Use environment-specific values** for staging vs production
5. **Verify email domains** in Brevo before using them

## 🔗 Related Files

- `wrangler.toml` - Environment configuration
- `src/utils/types.ts` - TypeScript interfaces
- `src/utils/sendEmailViaBrevo.ts` - Email integration
- `src/utils/handleContactForm.ts` - Form processing
- `docs/CLOUDFLARE_DEPLOYMENT.md` - Deployment instructions
