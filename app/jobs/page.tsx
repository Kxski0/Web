import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { Button } from '@/components/Button';
import { Reveal } from '@/components/Reveal';
import { unternehmen } from '@/content/unternehmen';

export const metadata: Metadata = {
  title: 'Jobs',
  description: `Arbeiten bei ${unternehmen.marke} in ${unternehmen.ort}. Offene Stellen und Initiativbewerbungen.`,
};

/**
 * Zu offenen Stellen liegen keine Angaben vor.
 *
 * Erfundene Stellenausschreibungen kommen nicht in Frage, deshalb steht hier
 * bewusst der ehrliche Weg ueber die Initiativbewerbung. Sobald konkrete
 * Stellen benannt sind, werden sie hier als Liste ergaenzt — sinnvollerweise
 * mit JobPosting-Schema.
 */
export default function JobsSeite() {
  return (
    <>
      <PageHeader
        label="JOBS"
        headline="Arbeiten bei Energie Zentrum Saar."
        intro="Wir sind ein regionaler Betrieb mit einem breiten Themenfeld — von Energieberatung über Photovoltaik bis zur Hausverwaltung."
      />
      <Section>
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-body text-text-muted">
              Aktuell sind an dieser Stelle keine Stellen ausgeschrieben. Wenn Sie
              sich vorstellen können, bei uns zu arbeiten, freuen wir uns trotzdem
              über Ihre Nachricht — schreiben Sie uns, was Sie mitbringen und
              woran Sie arbeiten möchten.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/kontakt">Initiativ bewerben</Button>
              <Button href={unternehmen.emailHref} variant="ghost">
                {unternehmen.email}
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
