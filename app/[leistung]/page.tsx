import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Section } from '@/components/Section';
import { DisplayHeading } from '@/components/DisplayHeading';
import { SectionLabel } from '@/components/SectionLabel';
import { ImageCard } from '@/components/ImageCard';
import { Button } from '@/components/Button';
import { Reveal } from '@/components/Reveal';
import { FAQ } from '@/components/FAQ';
import { CTAAbschluss } from '@/components/CTAAbschluss';
import { JsonLd } from '@/components/JsonLd';
import {
  cluster,
  leistungen,
  leistungNachSlug,
  leistungenNachCluster,
} from '@/content/leistungen';
import { bildFuerCluster } from '@/content/media';
import { unternehmen } from '@/content/unternehmen';

/**
 * Landingpage je Leistung.
 *
 * Die Route liegt bewusst auf der obersten Ebene (/photovoltaik statt
 * /leistungen/photovoltaik) — kurze, eindeutige URLs je Suchintention.
 * Statische Segmente wie /kontakt haben in Next Vorrang vor der dynamischen
 * Route, und dynamicParams = false laesst unbekannte Slugs korrekt auf 404
 * laufen.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return leistungen.map((l) => ({ leistung: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ leistung: string }>;
}): Promise<Metadata> {
  const { leistung: slug } = await params;
  const l = leistungNachSlug(slug);
  if (!l) return {};

  return {
    title: { absolute: l.seoTitle },
    description: l.seoDescription,
    alternates: { canonical: `/${l.slug}` },
    openGraph: { title: l.seoTitle, description: l.seoDescription },
  };
}

export default async function LeistungsSeite({
  params,
}: {
  params: Promise<{ leistung: string }>;
}) {
  const { leistung: slug } = await params;
  const l = leistungNachSlug(slug);
  if (!l) notFound();

  const bereich = cluster.find((c) => c.id === l.cluster);
  const verwandte = leistungenNachCluster(l.cluster).filter((x) => x.slug !== l.slug);

  return (
    <>
      {/* Buehne */}
      <section className="bg-vellum pb-16 pt-40">
        <div className="container-page">
          <SectionLabel className="mb-6">{l.name.toUpperCase()}</SectionLabel>
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <DisplayHeading as="h1">{l.h1}</DisplayHeading>
              <p className="mt-6 max-w-xl text-body text-text-muted">{l.intro}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button href="/kontakt">{l.ctaLabel}</Button>
                <Button href="/leistungen" variant="ghost">
                  Alle Leistungen
                </Button>
              </div>
            </div>
            <Reveal delay={100}>
              <ImageCard src={bildFuerCluster(l.cluster)} alt="" priority />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Leistungsumfang */}
      <Section label="UMFANG" surface="white">
        <Reveal>
          <DisplayHeading className="mb-12 max-w-2xl">
            Was dazugehört.
          </DisplayHeading>
        </Reveal>
        <ol className="border-t border-hairline">
          {l.umfang.map((u, i) => (
            <Reveal as="li" key={u.titel} delay={i * 60}>
              <div className="grid gap-3 border-b border-hairline py-8 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.4fr)] md:gap-12">
                <span className="text-label uppercase tracking-[0.12em] text-text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-subheading font-normal text-carbon-warm">
                  {u.titel}
                </h3>
                <p className="max-w-xl text-body text-text-muted">{u.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Haeufige Fragen */}
      {l.faq && l.faq.length > 0 ? (
        <Section label="HÄUFIGE FRAGEN">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-start">
            <Reveal>
              <DisplayHeading>Fragen, die häufig kommen.</DisplayHeading>
            </Reveal>
            <FAQ eintraege={l.faq} />
          </div>
        </Section>
      ) : null}

      {/* Interne Verlinkung im selben Bereich */}
      {verwandte.length > 0 && bereich ? (
        <Section label={`WEITERES AUS ${bereich.name.toUpperCase()}`} surface="white">
          <ul className="border-t border-hairline">
            {verwandte.map((v, i) => (
              <Reveal as="li" key={v.slug} delay={i * 60}>
                <Link
                  href={`/${v.slug}`}
                  className="group grid gap-3 border-b border-hairline py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:items-baseline md:gap-12"
                >
                  <h3 className="text-heading font-light text-carbon-warm">
                    {v.name}
                  </h3>
                  <p className="max-w-xl text-body text-text-muted">{v.intro}</p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Section>
      ) : null}

      <CTAAbschluss />

      <JsonLd
        daten={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: l.name,
          description: l.seoDescription,
          areaServed: unternehmen.region,
          provider: {
            '@type': 'LocalBusiness',
            name: unternehmen.marke,
            address: {
              '@type': 'PostalAddress',
              streetAddress: unternehmen.strasse,
              postalCode: unternehmen.plz,
              addressLocality: unternehmen.ort,
              addressCountry: unternehmen.land,
            },
          },
        }}
      />
    </>
  );
}
