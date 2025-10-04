/** @type {import('next').NextConfig} */
const nextConfig = {
  // Always use static export for pure static blog
  output: 'export',
  trailingSlash: true,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable image optimization for static export but enable compression
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },
  
  // Optimize performance
  poweredByHeader: false,
  compress: true,
  
  // Better caching
  generateEtags: true,
}

export default nextConfig
