import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { Reveal } from '@/components/Reveal';
import { CTAAbschluss } from '@/components/CTAAbschluss';
import { cluster, leistungenNachCluster } from '@/content/leistungen';

export const metadata: Metadata = {
  title: 'Leistungen',
  description:
    'Energiekosten senken, Energie erzeugen und nutzen, Gebäude verbessern, Immobilien verwalten — alle Leistungen von Energie Zentrum Saar im Überblick.',
};

export default function LeistungenSeite() {
  return (
    <>
      <PageHeader
        label="LEISTUNGEN"
        headline="Fünf Bereiche, ein Ansprechpartner."
        intro="Die wenigsten Themen lassen sich sauber trennen: Wer seine Heizung tauscht, ändert seinen Stromverbrauch. Wer saniert, verändert den Wärmebedarf. Deshalb betrachten wir die Bereiche zusammen."
      />

      {cluster.map((c, index) => {
        const eintraege = leistungenNachCluster(c.id);
        return (
          <Section
            key={c.id}
            label={c.name.toUpperCase()}
            labelAs="h2"
            surface={index % 2 === 1 ? 'white' : 'vellum'}
            id={c.id}
          >
            <Reveal>
              <p className="mb-10 max-w-xl text-body text-text-muted">
                {c.unterzeile}
              </p>
            </Reveal>

            <ul className="border-t border-hairline">
              {eintraege.map((l, i) => (
                <Reveal as="li" key={l.slug} delay={i * 70}>
                  <Link
                    href={`/${l.slug}`}
                    className="group grid gap-3 border-b border-hairline py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] md:items-baseline md:gap-12"
                  >
                    <h3 className="text-heading font-light text-carbon-warm">
                      {l.name}
                    </h3>
                    <p className="max-w-xl text-body text-text-muted">{l.intro}</p>
                    <span className="text-label uppercase tracking-[0.12em] text-text-muted transition-colors group-hover:text-carbon-warm">
                      {l.zielgruppe}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </Section>
        );
      })}

      <CTAAbschluss />
    </>
  );
}
