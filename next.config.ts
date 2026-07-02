import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Images are unoptimized-safe by default; add remote patterns here when
  // real project photos live on a CDN.
};

export default nextConfig;
