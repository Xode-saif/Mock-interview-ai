import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // handles eslint errors
  eslint:{
    ignoreDuringBuilds:true,
  },
  typescript:{
    ignoreBuildErrors:true
  }
};

export default nextConfig;
