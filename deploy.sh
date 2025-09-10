#!/bin/bash

# Candor Fiction Cloudflare Workers Setup Script

echo "🚀 Setting up Candor Fiction for Cloudflare Workers deployment..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler

    # Check if wrangler is installed after installation
    if ! command -v wrangler &> /dev/null; then
        echo "❌ Failed to install Wrangler CLI. Please install it manually."
        exit 1
    fi
fi

echo "✅ Wrangler CLI is available"

# Login to Cloudflare (if not already logged in)
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "Please login to Cloudflare:"
    wrangler auth login
else
    echo "✅ Already logged in to Cloudflare"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check for errors above."
    exit 1
fi

# Ask which environment to deploy to
echo ""
echo "Which environment would you like to deploy to?"
echo "1) Staging (candorfiction-staging.workers.dev)"
echo "2) Production (candorfiction-production.workers.dev)"
echo "3) Default (candorfiction-website.workers.dev)"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🚀 Deploying to staging..."
        wrangler deploy --env staging
        ;;
    2)
        echo "🚀 Deploying to production..."
        wrangler deploy --env production
        ;;
    3)
        echo "🚀 Deploying to default environment..."
        wrangler deploy
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "Your website is now live on Cloudflare Workers!"
    echo "You can view the deployment in your Cloudflare dashboard."
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi
