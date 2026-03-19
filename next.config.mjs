/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/suivi-indh',
  assetPrefix: '/suivi-indh/',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
}

export default nextConfig
