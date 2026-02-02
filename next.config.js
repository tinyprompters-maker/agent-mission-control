/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // For Cloudflare Pages
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
  // App router
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
