import path from 'node:path';
import type { NextConfig } from 'next';

/**
 * Sicherheits-Header.
 *
 * Die Seite lädt nichts von Dritten: Schriften kommen selbst gehostet über
 * next/font, Bilder und das Hero-Video liegen im eigenen Ursprung, es gibt
 * kein Analytics, keinen Tag Manager und kein Instagram-Embed — der Abschnitt
 * auf der Startseite verlinkt das Profil, statt es einzubetten. Damit kann die
 * Policy eng bleiben, ohne etwas zu brechen.
 *
 * `script-src` braucht weiterhin 'unsafe-inline': Next injiziert Inline-Skripte
 * für Bootstrap und Hydration. Das sauber zu schließen bräuchte eine Nonce pro
 * Request aus einer Middleware — und damit wäre jede Seite dynamisch statt
 * statisch. Der Tausch lohnt für eine Schaufenster-Website nicht, in der kein
 * fremdes HTML entsteht.
 *
 * `media-src 'self'` ist gegenüber dem Wurzelprojekt neu: hier liegt ein
 * Hero-Video im eigenen Ursprung.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  /*
   * Ohne diese Angabe sucht Next die Projektwurzel selbst und findet das
   * Lockfile des Elternverzeichnisses — dort liegt das andere Projekt in
   * diesem Repository. Die Wurzel hier ausdrücklich zu setzen, ist genau die
   * Trennung, um die es geht: dieser Build sieht nur dieses Verzeichnis.
   */
  turbopack: { root: path.resolve(import.meta.dirname) },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  trailingSlash: true,
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: SECURITY_HEADERS },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        // Das Hero-Video ändert sich seltener als die Fotos und wiegt mehr.
        source: '/video/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },
};

export default nextConfig;
