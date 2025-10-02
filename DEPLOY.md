# Deploy to Cloudflare Pages

This guide will help you deploy your blog to Cloudflare Pages with D1 database.

## Prerequisites

1. A Cloudflare account
2. Wrangler CLI installed globally: `npm install -g wrangler`

## Step 1: Install Cloudflare Dependencies

```bash
npm install @cloudflare/workers-types wrangler
```

## Step 2: Login to Cloudflare

```bash
wrangler login
```

## Step 3: Create D1 Database

```bash
wrangler d1 create udaxgui-blog-db
```

This will give you a database ID. Copy it and update the `database_id` in `wrangler.toml`.

## Step 4: Create Database Schema in D1

```bash
# Create the tables in your D1 database
wrangler d1 execute udaxgui-blog-db --file=./prisma/schema.sql
```

## Step 5: Seed D1 Database

```bash
# You'll need to create migration SQL files or use the Prisma schema
wrangler d1 execute udaxgui-blog-db --command="CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, excerpt TEXT NOT NULL, content TEXT NOT NULL, category TEXT NOT NULL, image TEXT NOT NULL, metaDescription TEXT NOT NULL, published BOOLEAN DEFAULT 1, featured BOOLEAN DEFAULT 0, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP);"

wrangler d1 execute udaxgui-blog-db --command="CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, slug TEXT UNIQUE NOT NULL, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP);"
```

## Step 6: Deploy to Cloudflare Pages

### Option A: Via Git Integration (Recommended)

1. Push your code to GitHub/GitLab
2. Go to Cloudflare Dashboard > Pages
3. Click "Create a project" > "Connect to Git"
4. Select your repository
5. Set build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/`

### Option B: Direct Upload

```bash
# Build your project
npm run build

# Deploy with Wrangler
wrangler pages deploy .next
```

## Step 7: Environment Variables

In your Cloudflare Pages dashboard, set these environment variables:

- `NODE_ENV`: `production`
- `DATABASE_URL`: `d1://your-database-binding`

## Step 8: Configure Database Binding

Make sure your `wrangler.toml` has the correct database binding:

```toml
[[d1_databases]]
binding = "DB"
database_name = "udaxgui-blog-db"
database_id = "your-actual-database-id"
```

## Alternative: Using Turso (Easier Setup)

If you prefer a simpler setup, you can use Turso instead of D1:

1. Sign up at [turso.tech](https://turso.tech)
2. Create a database: `turso db create udaxgui-blog`
3. Get connection string: `turso db show udaxgui-blog --url`
4. Update your `DATABASE_URL` environment variable

## Build Command for Cloudflare Pages

Your build settings should be:
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Node.js version**: `18` or higher

## Important Notes

- Your admin panel will work on Cloudflare Pages
- Static generation will use your database data
- API routes will work with D1/Turso database
- Images should be uploaded to Cloudflare Images or another CDN

## Troubleshooting

1. **Build errors**: Make sure all dependencies are in `dependencies`, not `devDependencies`
2. **Database errors**: Verify your DATABASE_URL and database schema
3. **API issues**: Check that your database binding is correctly configured

## Cost

- Cloudflare Pages: Free tier includes 500 builds/month
- D1 Database: Free tier includes 100,000 reads/day
- Total: Free for most personal blogs!