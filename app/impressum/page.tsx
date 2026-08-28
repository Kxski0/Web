import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';

export const metadata: Metadata = { title: 'Impressum' };

/**
 * PFLICHTSEITE nach § 5 DDG (frueher § 5 TMG).
 *
 * Struktur steht, Inhalte sind Platzhalter. Die Angaben muessen vom
 * Unternehmen kommen und rechtlich geprueft werden — insbesondere
 * Rechtsform, Vertretungsberechtigte, Registereintrag und
 * Umsatzsteuer-Identifikationsnummer.
 */
export default function ImpressumSeite() {
  return (
    <>
      <PageHeader label="RECHTLICHES" headline="Impressum" />
      <Section>
        <div className="max-w-2xl space-y-10 text-body">
          <div>
            <h2 className="text-subheading font-normal">Angaben gemäß § 5 DDG</h2>
            {/* PLATZHALTER — vom Unternehmen zu ergaenzen */}
            <p className="mt-3 text-text-muted">
              EnergieSaar
              <br />
              Musterstraße 1
              <br />
              66111 Saarbrücken
            </p>
          </div>

          <div>
            <h2 className="text-subheading font-normal">Vertreten durch</h2>
            {/* PLATZHALTER */}
            <p className="mt-3 text-text-muted">Geschäftsführung: —</p>
          </div>

          <div>
            <h2 className="text-subheading font-normal">Kontakt</h2>
            {/* PLATZHALTER */}
            <p className="mt-3 text-text-muted">
              Telefon: +49 681 000000
              <br />
              E-Mail: info@energiesaar.de
            </p>
          </div>

          <div>
            <h2 className="text-subheading font-normal">Registereintrag</h2>
            {/* PLATZHALTER */}
            <p className="mt-3 text-text-muted">
              Registergericht: —
              <br />
              Registernummer: —
            </p>
          </div>

          <div>
            <h2 className="text-subheading font-normal">Umsatzsteuer-ID</h2>
            {/* PLATZHALTER */}
            <p className="mt-3 text-text-muted">
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: —
            </p>
          </div>

          <div>
            <h2 className="text-subheading font-normal">
              Verantwortlich für den Inhalt
            </h2>
            {/* PLATZHALTER */}
            <p className="mt-3 text-text-muted">—</p>
          </div>
        </div>
      </Section>
    </>
  );
}
