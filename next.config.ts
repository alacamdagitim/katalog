import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_SECRET: process.env.ADMIN_SECRET,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
    ],
  },
};

export default nextConfig;
