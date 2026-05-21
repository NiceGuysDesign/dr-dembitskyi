import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "gsap",
      "motion",
      "lenis",
      "lottie-web",
      "swiper",
      "react-i18next",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ancient-compassion-c978f136b7.media.strapiapp.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
