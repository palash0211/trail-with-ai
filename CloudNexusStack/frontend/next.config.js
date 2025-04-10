/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/welcome',
        permanent: true,
      },
    ];
  },
  // Allow import from shared directory
  transpilePackages: ['@shared'],
  // Configure API URL based on environment
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8000'
  }
};

module.exports = nextConfig;
