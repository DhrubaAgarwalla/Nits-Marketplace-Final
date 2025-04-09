import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  },
};

export default nextConfig;
