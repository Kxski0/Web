import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { unternehmen } from '@/content/unternehmen';
import { basisUrl, istProduktion } from '@/lib/site';
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

export const metadata: Metadata = {
  metadataBase: new URL(basisUrl),
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
  /*
    Nur die Produktion darf indexiert werden. Ein Vorschau-Deployment traegt
    den echten Firmennamen und die echte Anschrift, aber ein noch
    unvollstaendiges Impressum — das gehoert nicht in den Suchindex.
  */
  robots: istProduktion
    ? { index: true, follow: true }
    : { index: false, follow: false },
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
            url: basisUrl,
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
