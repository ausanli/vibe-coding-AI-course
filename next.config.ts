import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Skip ESLint during production builds to avoid blocking on missing dev dependency
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
