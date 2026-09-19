import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { Footer } from '@/components/chrome/Footer';
import { StickyMobileBar } from '@/components/chrome/StickyMobileBar';
import { Header } from '@/components/chrome/Header';
import { SkipLink } from '@/components/chrome/SkipLink';
import { SITE } from '@/content/site';
import { INDEXABLE } from '@/lib/env';
import { organizationSchema } from '@/lib/schema';
import './globals.css';

/**
 * Serif trägt Emotion, Sans trägt Information.
 *
 * Cormorant Garamond nur in 300/400 geladen: die Schrift lebt von ihren feinen
 * Strichen, fett gesetzt verliert sie genau das. Halbfett und fett werden auf
 * dieser Seite nirgends gebraucht — Betonung entsteht über Größe und Raum.
 */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  weight: ['300', '400'],
  style: ['normal', 'italic'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.descriptor} in Köln`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.descriptor} in Köln`,
    description: SITE.description,
    url: SITE.url,
  },
  robots: { index: INDEXABLE, follow: INDEXABLE },
};

export const viewport: Viewport = {
  themeColor: '#f7f3ec',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={SITE.lang} className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <SkipLink />
        <Header />
        <main id="hauptinhalt">{children}</main>
        <Footer />
        <StickyMobileBar />
        <script
          type="application/ld+json"
          // Aus geprüften Feldern gebaut, kein Nutzereingabewert.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
      </body>
    </html>
  );
}
