import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export" removed — API routes & SSR require Node server
  basePath: "/stockpulse",
  assetPrefix: "/stockpulse/",
};

export default nextConfig;
