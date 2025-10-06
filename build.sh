#!/bin/bash
# Cloudflare Pages build script
echo "Starting build with npm..."
export DATABASE_URL="file:./build.db"
echo "Set DATABASE_URL to: $DATABASE_URL"
npm run build:static