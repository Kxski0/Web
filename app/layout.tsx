import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { unternehmen } from '@/content/unternehmen';
import './globals.css';

/**
 * Inter als Ersatz fuer T1 Sans (nicht oeffentlich verfuegbar).
 *
 * next/font/google laedt die Dateien zur Build-Zeit und liefert sie
 * anschliessend von der eigenen Domain — es entsteht keine Laufzeitverbindung
 * zu Google, was die DSGVO-Frage entschaerft.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/** Beim Deployment auf die echte Domain setzen. */
const basis = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.energie-zentrum-saar.de';

export const metadata: Metadata = {
  metadataBase: new URL(basis),
  title: {
    default: `${unternehmen.marke} — ${unternehmen.claim}`,
    template: `%s — ${unternehmen.marke}`,
  },
  description:
    'Ein Ansprechpartner für Energie, Kostenoptimierung, Sanierung, Bauen und Immobilien: Wir analysieren, beraten und begleiten die Umsetzung.',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: unternehmen.marke,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={inter.variable}>
      <head>
        {/*
          Markiert das Dokument als JavaScript-faehig, bevor CSS angewendet
          wird. Nur dann gilt der versteckte Startzustand der Einblend-
          Animation — ohne JavaScript bleibt aller Inhalt sichtbar.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.dataset.js='true'",
          }}
        />
      </head>
      <body>
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-[var(--radius-pill)] focus:bg-carbon-warm focus:px-[22px] focus:py-[18px] focus:text-body-sm focus:text-paper-white"
        >
          Zum Inhalt springen
        </a>
        <Nav />
        <main id="inhalt">{children}</main>
        <Footer />

        {/*
          Strukturierte Daten zum Unternehmen. Nur belegte Angaben — keine
          Bewertungen, Preise oder Oeffnungszeiten, die nicht bestaetigt sind.
        */}
        <JsonLd
          daten={{
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: unternehmen.marke,
            legalName: unternehmen.traeger,
            slogan: unternehmen.claim,
            url: basis,
            telephone: unternehmen.telefon,
            email: unternehmen.email,
            address: {
              '@type': 'PostalAddress',
              streetAddress: unternehmen.strasse,
              postalCode: unternehmen.plz,
              addressLocality: unternehmen.ort,
              addressRegion: unternehmen.region,
              addressCountry: unternehmen.land,
            },
          }}
        />
      </body>
    </html>
  );
}
