import type { Metadata, Viewport } from 'next';
import { Fraunces, Nunito_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { Footer } from '@/components/chrome/Footer';
import { Header } from '@/components/chrome/Header';
import { SkipLink } from '@/components/chrome/SkipLink';
import { SITE } from '@/content/site';
import { INDEXABLE } from '@/lib/env';
import { organizationSchema } from '@/lib/schema';
import './globals.css';

/**
 * Fraunces als Anzeigeschrift: ein weicher, leicht eigenwilliger Serif, der
 * neben dem handgezeichneten Logo bestehen kann, ohne es nachzuahmen. Die
 * `SOFT`- und `WONK`-Achsen sind bewusst mittig gesetzt — ganz weich wird es
 * niedlich, ganz hart verliert es den Ton des Ladens.
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['SOFT', 'WONK', 'opsz'],
});

const nunito = Nunito_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
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
  themeColor: '#faf6ef',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={SITE.lang} className={`${fraunces.variable} ${nunito.variable}`}>
      <body>
        <SkipLink />
        <Header />
        <main id="hauptinhalt">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          // Aus geprüften Feldern gebaut, kein Nutzereingabewert.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
      </body>
    </html>
  );
}
