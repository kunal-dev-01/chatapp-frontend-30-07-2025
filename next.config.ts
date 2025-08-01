import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d224dsaxc5uhvo.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
