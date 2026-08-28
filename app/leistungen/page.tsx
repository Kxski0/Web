import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { Accordion } from '@/components/Accordion';
import { ImageCard } from '@/components/ImageCard';
import { media } from '@/content/media';
import { leistungen, startseite } from '@/content/site';

export const metadata: Metadata = { title: 'Leistungen' };

export default function LeistungenSeite() {
  return (
    <>
      <PageHeader
        label="LEISTUNGEN"
        headline={leistungen.headline}
        intro={leistungen.intro}
      />
      <Section>
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
          <Accordion items={startseite.technikItems} />
          <ImageCard src={media.technik} alt="" aspect="aspect-square" />
        </div>
      </Section>
    </>
  );
}
