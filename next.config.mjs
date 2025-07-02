/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/ssr'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['placeholder.com'],
    unoptimized: true,
  },
  // Ensure proper build output for Vercel
  output: 'standalone',
  // Optimize for serverless functions
  poweredByHeader: false,
  compress: true,
  // Handle trailing slashes
  trailingSlash: false,
  // Optimize bundle
  swcMinify: true,
}

export default nextConfig
