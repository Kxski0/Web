import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Bilder werden auf Wunsch direkt von Unsplash eingebunden.
    // Hinweis: Damit entsteht bei jedem Seitenaufruf eine Verbindung zu einem
    // Drittanbieter — das ist in der Datenschutzerklaerung vermerkt.
    // Wechsel auf lokale Bilder = reiner Pfad-Austausch in den src-Attributen.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
