import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { unternehmen } from '@/content/unternehmen';

export const metadata: Metadata = {
  title: 'Impressum',
  description:
    'Impressum und Anbieterkennzeichnung der EZS GmbH, Energie Zentrum Saar, Saarwellingen.',
  robots: { index: false, follow: true },
};

/**
 * PFLICHTSEITE nach § 5 DDG.
 *
 * Anschrift und Kontakt sind echt. Rechtsform-Details (Vertretungsberechtigte,
 * Registergericht, Registernummer, Umsatzsteuer-Identifikationsnummer) liegen
 * nicht vor und sind als Platzhalter markiert — sie muessen vom Unternehmen
 * kommen und rechtlich geprueft werden. Erfundene Registerdaten waeren nicht
 * nur falsch, sondern abmahnfaehig.
 */
export default function ImpressumSeite() {
  return (
    <>
      <PageHeader label="RECHTLICHES" headline="Impressum" />
      <Section>
        <div className="max-w-2xl space-y-10 text-body">
          <div>
            <h2 className="text-subheading font-normal">Angaben gemäß § 5 DDG</h2>
            <p className="mt-3 text-text-muted">
              {unternehmen.traeger}
              <br />
              {unternehmen.marke}
              <br />
              {unternehmen.strasse}
              <br />
              {unternehmen.plz} {unternehmen.ort}
            </p>
          </div>

          <div>
            <h2 className="text-subheading font-normal">Kontakt</h2>
            <p className="mt-3 text-text-muted">
              Telefon: {unternehmen.telefon}
              <br />
              E-Mail: {unternehmen.email}
            </p>
          </div>

          <div>
            <h2 className="text-subheading font-normal">Vertreten durch</h2>
            {/* PLATZHALTER — vom Unternehmen zu ergänzen */}
            <p className="mt-3 text-text-muted">Geschäftsführung: —</p>
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
