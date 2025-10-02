/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for static export and Cloudflare Pages
  output: 'standalone',
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable image optimization for Cloudflare Pages
  images: {
    unoptimized: true,
  },
  
  // Optimize build for deployment
  swcMinify: true,
  
  // Configure headers for better caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

export default nextConfig
