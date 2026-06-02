import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-auth", "@better-auth/expo"],
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
