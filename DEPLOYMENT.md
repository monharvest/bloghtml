# Cloudflare Pages Deployment Instructions

## Quick Deployment

To deploy your blog to Cloudflare Pages, simply run:

```bash
./deploy-cf.sh
```

## Manual Deployment Steps

If you prefer to run the commands manually:

### 1. Clean and prepare
```bash
# Clean previous builds
rm -rf .next out

# Temporarily move API routes (required for static export)
mv app/api /tmp/api_backup
```

### 2. Build with static export
```bash
# Build the static version
STATIC_EXPORT=true npm run build
```

### 3. Deploy to Cloudflare Pages
```bash
# Deploy the out directory
npx wrangler pages deploy out --project-name blog --commit-dirty=true
```

### 4. Restore for local development
```bash
# Restore API routes for local development
mv /tmp/api_backup app/api
```

## Additional Commands

### Check deployment status
```bash
npx wrangler pages deployment list --project-name blog
```

### View deployment logs
```bash
npx wrangler pages deployment tail --project-name blog
```

### Set up custom domain (optional)
```bash
npx wrangler pages project create blog --compatibility-date 2024-01-01
```

## Important Notes

- **Static Export**: Cloudflare Pages deployment uses static export, which means API routes won't work in production
- **Local Development**: API routes are preserved for local development (`npm run dev`)
- **Content Management**: Use the admin panel locally to manage content, then deploy the updated static files
- **Images**: All images are included in the static export and served directly from Cloudflare

## Troubleshooting

### Build fails
- Make sure API routes are moved: `mv app/api /tmp/api_backup`
- Check for TypeScript errors: `npm run type-check`

### Deployment fails
- Check file size limits (25MB max per file)
- Verify wrangler authentication: `npx wrangler auth login`

### Site not loading
- Wait 1-2 minutes for propagation
- Check deployment status: `npx wrangler pages deployment list --project-name blog`
- Clear browser cache

## Current Configuration

- **Project Name**: blog
- **Build Output**: out/ directory (static export)
- **Environment**: Production builds use static export, development uses full Next.js features