import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  env: {
    NEXT_PUBLIC_GO_API_URL: process.env.NEXT_PUBLIC_GO_API_URL || 'http://backend:8080',
  }
};

export default nextConfig;
