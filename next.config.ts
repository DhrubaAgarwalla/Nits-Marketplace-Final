import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['uhbslznabvkxrrkgeyaq.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uhbslznabvkxrrkgeyaq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/webp'],
    // Enable image optimization
    unoptimized: false,
  },
};

export default nextConfig;
