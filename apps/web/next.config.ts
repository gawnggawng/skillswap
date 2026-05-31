import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@skillswap/types",
    "@skillswap/api",
    "@skillswap/db",
    "@skillswap/ui",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ufs.sh",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
