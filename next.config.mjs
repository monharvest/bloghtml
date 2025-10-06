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
    // Remove or comment out unrecognized options like 'bundlePagesRouterDependencies'
    // Add valid ones if needed, e.g., 'appDir': true
  },
  
  outputFileTracingRoot: '/Users/batulziiulziikhuu/Desktop/blog',  // Set to project root
};

export default nextConfig;
