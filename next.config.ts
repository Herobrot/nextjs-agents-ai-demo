import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  "distDir": "build",
  "trailingSlash": true,
  pageExtensions: ["ts", "tsx"],
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
