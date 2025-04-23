import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/avatar/**',
      },
      {
        protocol: 'https',
        hostname: 'your-vercel-domain.vercel.app',
        pathname: '/api/avatar/**',
      },
    ],
    domains: ['assets.coincap.io'],
  },
};

export default nextConfig;
