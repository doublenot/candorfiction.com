# Candor Fiction Website

Professional creative services specializing in commercial photography, story research & development, and creative writing. **It's All About the Story.**

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🌐 Deployment to Cloudflare Workers

This website is configured to deploy on Cloudflare Workers for global edge performance.

### Option 1: Using the Deploy Script (Easiest)

```bash
./deploy.sh
```

### Option 2: Manual Commands

```bash
# 1. Login to Cloudflare
npm run cf:login

# 2. Deploy to staging first (for testing)
npm run deploy:staging

# 3. Deploy to production
npm run deploy:production
```

### Option 3: Local Testing with Workers

```bash
# Test worker locally
npm run build
npm run cf:dev
```

## 🌍 Deployment URLs

- **Staging**: `candorfiction-staging.workers.dev`
- **Production**: `candorfiction-production.workers.dev`
- **Default**: `candorfiction-website.workers.dev`

## 🛠 Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally
- `npm run deploy` - Quick deployment to Cloudflare Workers
- `npm run deploy:staging` - Deploy to staging environment
- `npm run deploy:production` - Deploy to production environment
- `npm run cf:dev` - Local Cloudflare Workers development
- `npm run cf:login` - Authenticate with Cloudflare

## 🏗 Tech Stack

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM
- **Build Tool**: Vite 7
- **Hosting**: Cloudflare Workers
- **Deployment**: Wrangler CLI

## 📁 Project Structure

```
├── src/
│   ├── components/           # React components
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   └── Services.tsx
│   ├── pages/               # Route pages
│   │   ├── Home.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   └── TermsAndConditions.tsx
│   ├── config/              # Configuration files
│   │   ├── siteConfig.json  # Site settings & content
│   │   └── types.ts         # TypeScript interfaces
│   ├── worker.ts            # Cloudflare Worker script
│   └── App.tsx              # Main React app
├── dist/                    # Build output
├── wrangler.toml           # Cloudflare Workers config
└── deploy.sh               # Easy deployment script
```

## ⚙️ Configuration

Site configuration is centralized in `src/config/siteConfig.json`:

- Contact information (email, phone)
- Social media links
- Company details
- Legal document dates

## 🔧 Custom Domain Setup

1. Add your domain to Cloudflare
2. Update `wrangler.toml` routes section:
   ```toml
   routes = [
     { pattern = "yourdomain.com/*", zone_name = "yourdomain.com" }
   ]
   ```
3. Deploy: `npm run deploy:production`

## 💰 Cloudflare Workers Benefits

- **Global CDN** - Lightning fast worldwide
- **Free Tier** - 100,000 requests/day
- **Edge Computing** - Response from nearest location
- **99.9% Uptime** - Enterprise-grade reliability
- **HTTPS** - Automatic SSL certificates
- **DDoS Protection** - Built-in security

## 📚 Documentation

- [Cloudflare Workers Deployment Guide](./CLOUDFLARE_DEPLOYMENT.md)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Deploy to staging with `npm run deploy:staging`
6. Submit a pull request

## 📝 License

All rights reserved © 2025 Candor Fiction
