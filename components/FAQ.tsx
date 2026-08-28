import { Accordion } from './Accordion';
import { JsonLd } from './JsonLd';

/**
 * Haeufige Fragen inklusive strukturierter Daten.
 *
 * Das FAQPage-Schema wird nur ausgegeben, wenn tatsaechlich Fragen vorliegen —
 * leere oder erfundene Eintraege wuerden weder Nutzern noch Suchmaschinen
 * helfen.
 */
export function FAQ({ eintraege }: { eintraege: { frage: string; antwort: string }[] }) {
  if (eintraege.length === 0) return null;

  return (
    <>
      <Accordion
        items={eintraege.map((e) => ({ title: e.frage, body: e.antwort }))}
      />
      <JsonLd
        daten={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: eintraege.map((e) => ({
            '@type': 'Question',
            name: e.frage,
            acceptedAnswer: { '@type': 'Answer', text: e.antwort },
          })),
        }}
      />
    </>
  );
}
