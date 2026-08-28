import { Hero } from '@/components/Hero';
import { Section } from '@/components/Section';
import { DisplayHeading } from '@/components/DisplayHeading';
import { ImageCard } from '@/components/ImageCard';
import { Accordion } from '@/components/Accordion';
import { CaseStudyCard } from '@/components/CaseStudyCard';
import { Button } from '@/components/Button';
import { media } from '@/content/media';
import { startseite } from '@/content/site';

export default function Startseite() {
  return (
    <>
      <Hero src={media.hero} alt="" headline={startseite.heroHeadline}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button href="/leistungen" className="self-start">
            {startseite.heroCta}
          </Button>
          <CaseStudyCard
            label={startseite.referenzLabel}
            headline={startseite.referenzHeadline}
            thumbnailSrc={media.referenzThumbnail}
            thumbnailAlt=""
            className="max-w-sm"
          />
        </div>
      </Hero>

      {/* Auftrag — Text links, Bild rechts */}
      <Section label={startseite.missionLabel}>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <DisplayHeading>{startseite.missionHeadline}</DisplayHeading>
            <p className="mt-6 max-w-xl text-body text-text-muted">
              {startseite.missionBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/leistungen">Leistungen</Button>
              <Button href="/ueber-uns" variant="ghost">
                Über uns
              </Button>
            </div>
          </div>
          <ImageCard src={media.anlage} alt="" />
        </div>
      </Section>

      {/* Zwei Bilder nebeneinander, direkt auf der Vellum-Flaeche */}
      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <ImageCard src={media.montage} alt="" />
          <ImageCard src={media.technik} alt="" />
        </div>
      </Section>

      {/* Technik — Aufklappliste */}
      <Section label={startseite.technikLabel}>
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-start">
          <DisplayHeading>{startseite.technikHeadline}</DisplayHeading>
          <Accordion items={startseite.technikItems} />
        </div>
      </Section>
    </>
  );
}
