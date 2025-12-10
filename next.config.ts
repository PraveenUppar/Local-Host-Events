import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  staticPageGenerationTimeout: 100,
  experimental: {
    serverActions: {
      allowedOrigins: ["pavicodes.in", "localhost:3000"],
    },
  },
};

export default nextConfig;
