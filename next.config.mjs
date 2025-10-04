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
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
}

export default nextConfig
