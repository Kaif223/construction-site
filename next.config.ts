import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every route on this site is prerendered from local data, so Cache
  // Components gives us a fully static shell with no request-time work.
  cacheComponents: true,
  // Links prefetch each route's shared App Shell; URL-specific content streams
  // in behind Suspense (see the dynamic [slug] pages).
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 85],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
