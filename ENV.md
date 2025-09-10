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

### Email Integration (Brevo API)

#### `BREVO_API_KEY`

- **Type**: `string`
- **Required**: Yes (for email functionality)
- **Description**: API key for Brevo (formerly Sendinblue) email service
- **Usage**: Authenticates requests to Brevo API for sending emails
- **Security**: Sensitive - store as encrypted secret in Cloudflare dashboard
- **Example**: `"xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`

#### `BREVO_FROM_EMAIL`

- **Type**: `string` (email address)
- **Required**: Yes (for email functionality)
- **Description**: The "from" email address for outgoing emails
- **Usage**:
  - Business notification emails (from website to business)
  - Customer confirmation emails (from business to customer)
- **Requirements**: Must be a verified sender in your Brevo account
- **Example**: `"noreply@candorfiction.com"`

#### `BREVO_TO_EMAIL`

- **Type**: `string` (email address)
- **Required**: Yes (for email functionality)
- **Description**: The business email address to receive contact form submissions
- **Usage**: Receives notification emails when users submit the contact form
- **Example**: `"contact@candorfiction.com"`

### Security Variables

#### `CONTACT_FORM_SECRET`

- **Type**: `string`
- **Required**: Yes (for contact form security)
- **Description**: Secret key for HMAC signature verification of contact form submissions
- **Usage**: Validates that contact form requests are legitimate and prevents unauthorized API access
- **Security**: Highly sensitive - must be stored as encrypted secret
- **Requirements**: Should be a strong, random string (minimum 32 characters)
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

For security reasons, sensitive variables like `BREVO_API_KEY`, `BREVO_FROM_EMAIL`, `BREVO_TO_EMAIL`, and `CONTACT_FORM_SECRET` should be set as encrypted secrets rather than plain text in `wrangler.toml`.

#### Using Wrangler CLI:

```bash
# Set secrets for production
wrangler secret put BREVO_API_KEY --env production
wrangler secret put BREVO_FROM_EMAIL --env production
wrangler secret put BREVO_TO_EMAIL --env production
wrangler secret put CONTACT_FORM_SECRET --env production

# Set secrets for staging
wrangler secret put BREVO_API_KEY --env staging
wrangler secret put BREVO_FROM_EMAIL --env staging
wrangler secret put BREVO_TO_EMAIL --env staging
wrangler secret put CONTACT_FORM_SECRET --env staging
```

#### Using Cloudflare Dashboard:

1. Go to Workers & Pages → Your Worker → Settings
2. Navigate to "Variables and Secrets"
3. Add each variable as an "Encrypted" secret

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

The contact form requires all three Brevo variables to function:

1. **`BREVO_API_KEY`**: Authenticates with Brevo API
2. **`BREVO_FROM_EMAIL`**: Sender address for both notification and confirmation emails
3. **`BREVO_TO_EMAIL`**: Business email that receives contact form submissions

### Email Flow:

1. User submits contact form
2. System sends notification email to `BREVO_TO_EMAIL` (business)
3. System sends confirmation email to user's email address
4. Both emails are sent from `BREVO_FROM_EMAIL`

## 🔍 Usage in Code

### TypeScript Interface

Environment variables are typed in `src/utils/types.ts`:

```typescript
export interface Env {
  ASSETS: any; // Cloudflare Assets binding
  ENVIRONMENT: string; // Deployment environment
  BREVO_API_KEY: string; // Brevo API authentication
  BREVO_FROM_EMAIL: string; // Email sender address
  BREVO_TO_EMAIL: string; // Business notification email
}
```

### Function Usage

- **`src/worker.ts`**: Uses `ASSETS` for static file serving and `ENVIRONMENT` for logging
- **`src/utils/handleContactForm.ts`**: Uses `ENVIRONMENT` for logging context
- **`src/utils/sendEmailViaBrevo.ts`**: Uses all three Brevo variables for email functionality

## ✅ Validation

The system includes validation for missing environment variables:

```typescript
// Email functionality gracefully degrades if Brevo vars are missing
if (!env.BREVO_API_KEY || !env.BREVO_FROM_EMAIL || !env.BREVO_TO_EMAIL) {
  console.warn('Brevo configuration missing - email not sent');
  return false;
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
- `CLOUDFLARE_DEPLOYMENT.md` - Deployment instructions
