import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useWasmBinary: !process.env.VERCEL,
    webpackMemoryOptimizations: true,
    cpus: 1,
  },
};

export default nextConfig;
