import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { DisplayHeading } from '@/components/DisplayHeading';
import { ImageCard } from '@/components/ImageCard';
import { Reveal } from '@/components/Reveal';
import { Vertrauen } from '@/components/Vertrauen';
import { ReferenzStrip } from '@/components/ReferenzStrip';
import { CTAAbschluss } from '@/components/CTAAbschluss';
import { media } from '@/content/media';
import { ueberUns, warum, vertrauen } from '@/content/startseite';
import { unternehmen, positionierung } from '@/content/unternehmen';

export const metadata: Metadata = {
  title: 'Unternehmen',
  description:
    'Energie Zentrum Saar ist eine Marke der EZS GmbH aus Saarwellingen. Ein Ansprechpartner für Energie, Kostenoptimierung, Sanierung, Bauen und Immobilien.',
};

export default function UnternehmenSeite() {
  return (
    <>
      <PageHeader
        label="UNTERNEHMEN"
        headline={ueberUns.headline}
        intro={positionierung.kern}
      />

      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <div className="space-y-4">
              {ueberUns.text.map((t) => (
                <p key={t.slice(0, 24)} className="max-w-md text-body text-text-muted">
                  {t}
                </p>
              ))}
              <p className="max-w-md text-body text-text-muted">
                {unternehmen.marke} ist eine Marke der {unternehmen.traeger} mit Sitz in{' '}
                {unternehmen.ort}. {unternehmen.einzugsgebiet}
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            {/*
              Hier gehören echte Aufnahmen des Unternehmens hin — Gebäude,
              Team, umgesetzte Projekte. Bis dahin ein tonaler Platzhalter.
            */}
            <ImageCard src={media.team} alt="" />
          </Reveal>
        </div>
      </Section>

      <Section label={warum.label} surface="white">
        <Reveal>
          <DisplayHeading className="mb-12 max-w-2xl">{warum.headline}</DisplayHeading>
        </Reveal>
        <ul className="border-t border-hairline">
          {warum.punkte.map((p, i) => (
            <Reveal as="li" key={p.titel} delay={i * 60}>
              <div className="grid gap-2 border-b border-hairline py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-12">
                <h3 className="text-subheading font-normal text-carbon-warm">
                  {p.titel}
                </h3>
                <p className="max-w-xl text-body text-text-muted">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section label={vertrauen.label}>
        <Reveal>
          <DisplayHeading className="mb-12 max-w-2xl">{vertrauen.headline}</DisplayHeading>
        </Reveal>
        <Vertrauen />
      </Section>

      <Section surface="white">
        <ReferenzStrip />
      </Section>

      <CTAAbschluss />
    </>
  );
}
