import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { KontaktFormular } from '@/components/KontaktFormular';
import { Reveal } from '@/components/Reveal';
import { unternehmen } from '@/content/unternehmen';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: `Energie Zentrum Saar, ${unternehmen.strasse}, ${unternehmen.plz} ${unternehmen.ort}. Telefon ${unternehmen.telefon}, ${unternehmen.email}.`,
};

export default function KontaktSeite() {
  return (
    <>
      <PageHeader
        label="KONTAKT"
        headline="Sagen Sie uns, worum es geht."
        intro="Ein kurzer Hinweis genügt — wir melden uns und klären den Rest im Gespräch. Die Erstberatung kostet Sie nichts."
      />

      <Section>
        <div className="grid gap-16 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-24">
          <KontaktFormular />

          <div className="md:pt-2">
            <Reveal>
              <dl className="space-y-8">
                <div>
                  <dt className="text-label uppercase tracking-[0.12em] text-text-muted">
                    Telefon
                  </dt>
                  <dd className="mt-2 text-subheading font-light">
                    <a
                      href={unternehmen.telefonHref}
                      className="transition-opacity hover:opacity-65"
                    >
                      {unternehmen.telefon}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-label uppercase tracking-[0.12em] text-text-muted">
                    E-Mail
                  </dt>
                  <dd className="mt-2 text-body">
                    <a
                      href={unternehmen.emailHref}
                      className="transition-opacity hover:opacity-65"
                    >
                      {unternehmen.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-label uppercase tracking-[0.12em] text-text-muted">
                    Standort
                  </dt>
                  <dd className="mt-2 text-body">
                    <address className="not-italic">
                      {unternehmen.traeger}
                      <br />
                      {unternehmen.strasse}
                      <br />
                      {unternehmen.plz} {unternehmen.ort}
                    </address>
                  </dd>
                </div>
              </dl>
              <p className="mt-8 border-t border-hairline pt-6 text-body-sm text-text-muted">
                {unternehmen.einzugsgebiet}
              </p>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
