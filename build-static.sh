#!/bin/bash

echo "🔄 Generating static content from local database..."

# Set environment for local database access
export DATABASE_URL="file:./prisma/dev.db"

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Export data from local database
echo "📊 Exporting data from local database..."
npx tsx scripts/export-static-data.mjs

# Set environment for static export
export STATIC_EXPORT=true

# Build the static site
echo "🏗️ Building static site..."
npx next build

echo "✅ Static site generated in 'out' directory"
echo "🚀 Ready to deploy: npx wrangler pages deploy out --project-name=blog"