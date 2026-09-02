import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Manrope } from 'next/font/google';
import { Footer } from '@/components/chrome/Footer';
import { Header } from '@/components/chrome/Header';
import { SkipLink } from '@/components/chrome/SkipLink';
import { SITE } from '@/content/site';
import { INDEXABLE } from '@/lib/env';
import { organizationSchema } from '@/lib/schema';
import './globals.css';

/*
 * Two grotesks with different jobs: Geist carries the display sizes, where its
 * tight fit and flat terminals hold up at 150px; Manrope carries running text,
 * where its wider apertures read better at 16px. Both are self-hosted through
 * next/font, so there is no third-party request and no layout shift on swap.
 */
const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'SolBauTec — Energie, die weiterdenkt',
    template: '%s | SolBauTec',
  },
  description: SITE.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    title: 'SolBauTec — Energie, die weiterdenkt',
    description: SITE.description,
    url: SITE.url,
    images: [{ url: '/images/hero-energy-system.webp', width: 1536, height: 1024 }],
  },
  // Mirrors robots.txt: closed unless the deployment is explicitly cleared.
  robots: { index: INDEXABLE, follow: INDEXABLE },
};

export const viewport: Viewport = {
  themeColor: '#101211',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.lang} className={`${GeistSans.variable} ${manrope.variable}`}>
      <body>
        <SkipLink />
        <Header />
        <main id="hauptinhalt">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          // Built from confirmed fields only — see src/lib/schema.ts.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
      </body>
    </html>
  );
}
