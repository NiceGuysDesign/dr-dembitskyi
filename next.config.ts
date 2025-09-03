import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ancient-compassion-c978f136b7.media.strapiapp.com",
      },
    ],
  },
};

export default nextConfig;
