import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP fallback — Master Concept §39.
    formats: ['image/avif', 'image/webp'],
  },
  // Trailing slashes match the page structure defined in §9 (/photovoltaik/, ...).
  trailingSlash: true,
};

export default nextConfig;
