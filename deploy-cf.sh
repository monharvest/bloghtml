#!/bin/bash

# Cloudflare Pages Deployment Script
# This script builds and deploys the blog to Cloudflare Pages

echo "🚀 Starting Cloudflare Pages deployment..."

# Step 1: Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out

# Step 2: Temporarily move API routes (required for static export)
echo "📦 Temporarily moving API routes..."
if [ -d "app/api" ]; then
    mv app/api /tmp/api_backup_$(date +%s)
    echo "✅ API routes moved to temporary location"
else
    echo "ℹ️  No API routes found to move"
fi

# Step 3: Build with static export
echo "🔨 Building with static export..."
STATIC_EXPORT=true npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Restoring API routes..."
    if [ -d "/tmp/api_backup_*" ]; then
        mv /tmp/api_backup_* app/api 2>/dev/null
    fi
    exit 1
fi

# Step 4: Deploy to Cloudflare Pages
echo "☁️  Deploying to Cloudflare Pages..."
npx wrangler pages deploy out --project-name blog --commit-dirty=true

# Check if deployment was successful
if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    deployment_success=false
else
    echo "✅ Deployment successful!"
    deployment_success=true
fi

# Step 5: Restore API routes for local development
echo "🔄 Restoring API routes for local development..."
latest_backup=$(ls -t /tmp/api_backup_* 2>/dev/null | head -n1)
if [ -n "$latest_backup" ]; then
    mv "$latest_backup" app/api
    echo "✅ API routes restored"
else
    echo "⚠️  No API backup found to restore"
fi

# Final status
if [ "$deployment_success" = true ]; then
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "🌐 Your blog should be live on Cloudflare Pages"
    echo ""
    echo "💡 To check deployment status:"
    echo "   npx wrangler pages deployment list --project-name blog"
else
    echo ""
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi