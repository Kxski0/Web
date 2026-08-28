import { vertrauen } from '@/content/startseite';
import { Reveal } from './Reveal';

/**
 * Vertrauensmerkmale — bewusst ohne Kennzahlen.
 *
 * Es liegen keine belastbaren Unternehmenszahlen vor, und erfundene Zahlen
 * kommen nicht in Frage. Die Aussagen tragen deshalb typografisch, nicht
 * numerisch.
 */
export function Vertrauen() {
  return (
    <ul className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
      {vertrauen.punkte.map((p, i) => (
        <Reveal as="li" key={p.titel} delay={i * 80}>
          <h3 className="text-subheading font-normal text-carbon-warm">{p.titel}</h3>
          <p className="mt-2 max-w-sm text-body-sm text-text-muted">{p.text}</p>
        </Reveal>
      ))}
    </ul>
  );
}
