import type { NextConfig } from 'next';

/**
 * Security headers.
 *
 * The site loads nothing from a third party — fonts and images are self-hosted,
 * there is no analytics, no tag manager, no embed — so the policy can be tight
 * without breaking anything.
 *
 * `script-src` still needs 'unsafe-inline': Next injects inline bootstrap and
 * hydration scripts. Locking that down properly needs a per-request nonce from
 * middleware, which would make every page dynamic and give up the static
 * rendering the whole site currently gets. That trade is not worth it for a
 * marketing site with no user-generated HTML; the remaining directives still
 * block the things that actually matter here — foreign origins, framing, and
 * outbound connections.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
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
  images: {
    // AVIF first, WebP fallback — Master Concept §39.
    formats: ['image/avif', 'image/webp'],
  },
  // Trailing slashes match the page structure defined in §9 (/photovoltaik/, ...).
  trailingSlash: true,
  // Vercel already strips this; removing it here keeps parity in self-hosted runs.
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: SECURITY_HEADERS },
      {
        // Hashed build output is immutable; the brand and photo assets are not,
        // so they get a shorter window with revalidation.
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
