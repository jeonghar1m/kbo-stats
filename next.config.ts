import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["kbo-game"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
