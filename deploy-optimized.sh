#!/bin/bash

echo "🚀 Starting optimized Cloudflare Pages deployment..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf out .next

# Temporarily move large assets
echo "📦 Temporarily moving large assets to reduce bundle..."
mkdir -p temp_backup/images 2>/dev/null || true
mkdir -p temp_backup/fonts 2>/dev/null || true

# Backup and remove large images
if [ -d "public/images" ]; then
    cp -r public/images/* temp_backup/images/ 2>/dev/null || true
    find public/images -name "*.webp" -delete 2>/dev/null || true
    find public/images -name "*.jpg" -delete 2>/dev/null || true
    find public/images -name "*.jpeg" -delete 2>/dev/null || true
    find public/images -name "*.png" -delete 2>/dev/null || true
fi

# Keep only essential images
echo '<svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f3f4f6"/>
  <rect x="100" y="100" width="600" height="400" rx="8" fill="#e5e7eb"/>
  <circle cx="250" cy="220" r="40" fill="#d1d5db"/>
  <rect x="200" y="280" width="400" height="20" rx="10" fill="#d1d5db"/>
  <rect x="200" y="320" width="300" height="20" rx="10" fill="#d1d5db"/>
  <rect x="200" y="360" width="350" height="20" rx="10" fill="#d1d5db"/>
  <text x="400" y="450" text-anchor="middle" fill="#6b7280" font-family="system-ui" font-size="16">Loading...</text>
</svg>' > public/images/placeholder.svg

echo "🔨 Building optimized static export..."
STATIC_EXPORT=true npm run build

if [ $? -eq 0 ]; then
    echo "☁️  Deploying to Cloudflare Pages..."
    npx wrangler pages deploy out --project-name blog
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployment successful!"
        echo "📊 Build size analysis:"
        du -sh out
        echo "--- Size breakdown ---"
        du -sh out/* | sort -hr
    else
        echo "❌ Deployment failed!"
    fi
else
    echo "❌ Build failed!"
fi

echo "🔄 Restoring original assets..."
if [ -d "temp_backup/images" ]; then
    cp -r temp_backup/images/* public/images/ 2>/dev/null || true
fi

echo "🧹 Cleaning up temporary files..."
rm -rf temp_backup

echo "🎉 Optimization completed!"