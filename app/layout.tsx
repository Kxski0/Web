import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import './globals.css';

/**
 * Inter als Ersatz fuer T1 Sans (nicht oeffentlich verfuegbar).
 *
 * next/font/google laedt die Dateien zur Build-Zeit herunter und liefert sie
 * anschliessend von der eigenen Domain aus — es entsteht also keine
 * Laufzeitverbindung zu Google, was die DSGVO-Frage entschaerft.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'EnergieSaar',
    template: '%s — EnergieSaar',
  },
  description: 'EnergieSaar',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={inter.variable}>
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
      </body>
    </html>
  );
}
