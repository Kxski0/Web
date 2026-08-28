import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { ImageCard } from '@/components/ImageCard';
import { CaseStudyCard } from '@/components/CaseStudyCard';
import { media } from '@/content/media';
import { referenzen, startseite } from '@/content/site';

export const metadata: Metadata = { title: 'Referenzen' };

export default function ReferenzenSeite() {
  return (
    <>
      <PageHeader
        label="REFERENZEN"
        headline={referenzen.headline}
        intro={referenzen.intro}
      />
      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <ImageCard src={media.anlage} alt="" />
            <CaseStudyCard
              label={startseite.referenzLabel}
              headline={startseite.referenzHeadline}
              thumbnailSrc={media.referenzThumbnail}
              thumbnailAlt=""
            />
          </div>
          <ImageCard src={media.montage} alt="" />
        </div>
      </Section>
    </>
  );
}
