import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { ImageCard } from '@/components/ImageCard';
import { media } from '@/content/media';
import { ueberUns } from '@/content/site';

export const metadata: Metadata = { title: 'Über uns' };

export default function UeberUnsSeite() {
  return (
    <>
      <PageHeader label="ÜBER UNS" headline={ueberUns.headline} intro={ueberUns.intro} />
      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <ImageCard src={media.team} alt="" />
          <ImageCard src={media.anlage} alt="" />
        </div>
      </Section>
    </>
  );
}
