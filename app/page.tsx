import { Hero } from '@/components/Hero';
import { Section } from '@/components/Section';
import { DisplayHeading } from '@/components/DisplayHeading';
import { Bild } from '@/components/Bild';
import { media } from '@/content/media';
import { Button } from '@/components/Button';
import { Reveal } from '@/components/Reveal';
import { BereichListe } from '@/components/BereichListe';
import { ProzessSequenz } from '@/components/ProzessSequenz';
import { Vertrauen } from '@/components/Vertrauen';
import { ReferenzStrip } from '@/components/ReferenzStrip';
import { CTAAbschluss } from '@/components/CTAAbschluss';
import {
  hero,
  optimieren,
  prozessSection,
  ueberUns,
  warum,
  vertrauen,
} from '@/content/startseite';

export default function Startseite() {
  return (
    <>
      <Hero headline={hero.headline} subline={hero.subline}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button href={hero.ctaPrimaer.href} className="self-start">
            {hero.ctaPrimaer.label}
          </Button>
          <Button
            href={hero.ctaSekundaer.href}
            variant="ghostInvers"
            className="self-start"
          >
            {hero.ctaSekundaer.label}
          </Button>
        </div>
      </Hero>

      {/* Was koennen wir fuer Sie optimieren? */}
      <Section label={optimieren.label} id="bereiche">
        <Reveal>
          <div className="mb-12 max-w-2xl">
            <DisplayHeading enthuellen>{optimieren.headline}</DisplayHeading>
            <p className="mt-6 text-body text-text-muted">{optimieren.text}</p>
          </div>
        </Reveal>
        <BereichListe />
      </Section>

      {/* Vom Potenzial zur Loesung */}
      <Section label={prozessSection.label} surface="white">
        <Reveal>
          <div className="mb-16 max-w-2xl">
            <DisplayHeading enthuellen>{prozessSection.headline}</DisplayHeading>
            <p className="mt-6 text-body text-text-muted">{prozessSection.text}</p>
          </div>
        </Reveal>
        <ProzessSequenz />
      </Section>

      {/* Leistungsausblick */}
      <Section>
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <Bild szene="photovoltaik" foto={media.photovoltaik.foto} aspect="aspect-[5/4]" />
          <Reveal delay={100}>
            <DisplayHeading enthuellen>Ihre Energie. Auf Ihrem Dach.</DisplayHeading>
            <p className="mt-6 max-w-md text-body text-text-muted">
              Photovoltaik ist unser sichtbarster Leistungsbereich — aber nur einer
              von zehn. Was zu Ihrer Immobilie passt, zeigt die Analyse.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/photovoltaik">Photovoltaik</Button>
              <Button href="/leistungen" variant="ghost">
                Alle Leistungen
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Worauf Sie sich verlassen koennen */}
      <Section label={vertrauen.label} surface="white">
        <Reveal>
          <DisplayHeading enthuellen className="mb-12 max-w-2xl">
            {vertrauen.headline}
          </DisplayHeading>
        </Reveal>
        <Vertrauen />
      </Section>

      {/* Kunden */}
      <Section>
        <ReferenzStrip />
      </Section>

      {/* Warum Energie Zentrum Saar */}
      <Section label={warum.label} surface="white">
        <Reveal>
          <DisplayHeading enthuellen className="mb-12 max-w-2xl">
            {warum.headline}
          </DisplayHeading>
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

      {/* Ueber uns */}
      <Section label={ueberUns.label}>
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <DisplayHeading enthuellen>{ueberUns.headline}</DisplayHeading>
            <div className="mt-6 space-y-4">
              {ueberUns.text.map((t) => (
                <p key={t.slice(0, 24)} className="max-w-md text-body text-text-muted">
                  {t}
                </p>
              ))}
            </div>
            <div className="mt-8">
              <Button href="/unternehmen" variant="ghost">
                Über uns
              </Button>
            </div>
          </Reveal>
          <Bild szene="unternehmen" foto={media.unternehmen.foto} aspect="aspect-[5/4]" />
        </div>
      </Section>

      <CTAAbschluss />
    </>
  );
}
