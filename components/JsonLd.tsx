/**
 * Strukturierte Daten.
 *
 * Nur Angaben, die tatsaechlich belegt sind — keine erfundenen Bewertungen,
 * Preise oder Oeffnungszeiten.
 */
export function JsonLd({ daten }: { daten: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(daten) }}
    />
  );
}
