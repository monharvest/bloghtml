/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use different output based on environment
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
}

export default nextConfig