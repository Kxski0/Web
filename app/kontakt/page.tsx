import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { Button } from '@/components/Button';
import { kontakt } from '@/content/site';

export const metadata: Metadata = { title: 'Kontakt' };

/**
 * Bewusst ohne Formular.
 *
 * Ein Kontaktformular braucht eine Entscheidung ueber die Gegenstelle
 * (Mailversand, Empfaengeradresse, Einwilligungstext nach DSGVO). Solange
 * die nicht getroffen ist, waere ein Formular, das Eingaben ins Leere
 * schickt, schlechter als keines. Bis dahin: direkter Kontaktweg.
 */
export default function KontaktSeite() {
  return (
    <>
      <PageHeader label="KONTAKT" headline={kontakt.headline} intro={kontakt.intro} />
      <Section>
        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-label uppercase tracking-[0.12em] text-text-muted">
              Anschrift
            </dt>
            {/* PLATZHALTER */}
            <dd className="mt-2 text-body">
              EnergieSaar
              <br />
              Musterstraße 1
              <br />
              66111 Saarbrücken
            </dd>
          </div>
          <div>
            <dt className="text-label uppercase tracking-[0.12em] text-text-muted">
              Telefon
            </dt>
            {/* PLATZHALTER */}
            <dd className="mt-2 text-body">
              <a href="tel:+4968100000000" className="transition-opacity hover:opacity-65">
                +49 681 000000
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-label uppercase tracking-[0.12em] text-text-muted">
              E-Mail
            </dt>
            {/* PLATZHALTER */}
            <dd className="mt-2 text-body">
              <a
                href="mailto:info@energiesaar.de"
                className="transition-opacity hover:opacity-65"
              >
                info@energiesaar.de
              </a>
            </dd>
          </div>
        </dl>

        <div className="mt-12">
          <Button href="mailto:info@energiesaar.de">E-Mail schreiben</Button>
        </div>
      </Section>
    </>
  );
}
