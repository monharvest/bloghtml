/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === 'true'

const nextConfig = {
  // Switch between static export and server-side rendering
  output: isStaticExport ? 'export' : 'standalone',
  trailingSlash: isStaticExport ? true : false,
  
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
  
  // Only include headers for server-side rendering
  ...(isStaticExport ? {} : {
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
  }),
}

export default nextConfig
