# Cloudflare Workers Deployment Guide

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Domain**: Add your domain to Cloudflare (optional, you can use workers.dev subdomain)
3. **Node.js**: Ensure you have Node.js installed

## Setup Steps

### 1. Login to Cloudflare

```bash
npm run cf:login
```

### 2. Build and Deploy

#### For Development/Testing

```bash
# Deploy to staging environment
npm run deploy:staging
```

#### For Production

```bash
# Deploy to production environment
npm run deploy:production
```

#### Quick Deploy (uses default environment)

```bash
npm run deploy
```

### 3. Local Development with Workers

To test the worker locally with your built assets:

```bash
# First build the project
npm run build

# Then start local worker development
npm run cf:dev
```

## Custom Domain Setup

1. **Add your domain to Cloudflare**
2. **Update `wrangler.toml`** - Uncomment and modify the routes section:

```toml
   routes = [
     { pattern = "yourdomain.com/*", zone_name = "yourdomain.com" },
     { pattern = "www.yourdomain.com/*", zone_name = "yourdomain.com" }
   ]
```

3. **Deploy**: `npm run deploy:production`

## Environment Variables

You can add environment variables in `wrangler.toml`:

```toml
[vars]
API_URL = "https://api.example.com"
ENVIRONMENT = "production"
```

## Project Structure

```
├── src/
│   ├── worker.ts          # Cloudflare Worker script
│   ├── components/        # React components
│   └── pages/             # React pages
├── dist/                  # Built assets (created by npm run build)
├── wrangler.toml         # Cloudflare Workers configuration
└── tsconfig.worker.json  # TypeScript config for worker
```

## Worker Features

- **Static Asset Serving**: Serves your built React app
- **SPA Routing Support**: All routes serve index.html for client-side routing
- **Security Headers**: Adds security headers to all responses
- **Caching**: Optimized caching for static assets and HTML
- **Error Handling**: Graceful error handling with fallbacks

## Monitoring and Logs

View logs in real-time:

```bash
wrangler tail
```

## Pricing

- **Free Tier**: 100,000 requests/day
- **Paid Plans**: $5/month for 10 million requests
- **Static Assets**: Included with Workers

## Next Steps

1. Run `npm run cf:login` to authenticate
2. Run `npm run deploy:staging` to deploy to staging
3. Test your staging deployment
4. Run `npm run deploy:production` for production
5. Set up custom domain (optional)

## Troubleshooting

- **Build Issues**: Make sure `npm run build` works first
- **Asset Loading**: Check network tab for 404s on assets
- **Routing Issues**: Verify all routes redirect to index.html
- **Deployment Errors**: Check `wrangler.toml` configuration
