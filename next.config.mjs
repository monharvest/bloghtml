/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Cloudflare Pages, use static export only for production builds
  output: process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true' ? 'export' : undefined,
  trailingSlash: true,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Enhanced image optimization for responsive images
  images: {
    // Enable optimization for static export with smart fallback
    unoptimized: process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true',
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [], // Add external domains if needed
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Optimize performance and CSS delivery
  poweredByHeader: false,
  compress: true,
  
  // Better caching
  generateEtags: true,
  
  // Bundle size optimization
  experimental: {
    // Reduce bundle size
    bundlePagesRouterDependencies: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Webpack optimizations for smaller bundles
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Aggressive bundle optimization for production
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            styles: {
              name: 'styles',
              test: /\.(css|scss|sass)$/,
              chunks: 'all',
              enforce: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 100000, // 100KB max chunks
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
              maxSize: 50000, // 50KB max for common chunks
            },
          },
        },
        // Tree shaking optimization
        usedExports: true,
        sideEffects: false,
      }
      
      // Reduce bundle size further
      config.resolve.alias = {
        ...config.resolve.alias,
        // Use smaller alternatives where possible
        '@': '/Users/batulziiulziikhuu/Desktop/blog',
      }
    }
    return config
  },
}

export default nextConfig
