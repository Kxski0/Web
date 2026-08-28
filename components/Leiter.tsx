import { Reveal } from './Reveal';
import { cn } from '@/lib/cn';

/**
 * Nummerierte Leiter.
 *
 * Ersetzt an einer Stelle die Haarlinien-Liste, damit nicht vier Sektionen
 * hintereinander dieselbe Form haben. Die Ziffern sind gross gesetzt und
 * wechseln die Seite — dadurch entsteht ein Zickzack statt einer Tabelle.
 *
 * Die Nummerierung ist hier inhaltlich gedeckt: Es ist eine Aufzaehlung von
 * Unterscheidungsmerkmalen, keine erfundene Reihenfolge.
 */
export function Leiter({
  punkte,
}: {
  punkte: { titel: string; text: string }[];
}) {
  return (
    <ol className="flex flex-col gap-16 md:gap-24">
      {punkte.map((p, i) => {
        const rechts = i % 2 === 1;
        return (
          <Reveal as="li" key={p.titel} delay={i * 60}>
            <div
              className={cn(
                'flex flex-col gap-6 md:flex-row md:items-baseline md:gap-12',
                rechts && 'md:flex-row-reverse md:text-right',
              )}
            >
              <span
                aria-hidden="true"
                className="text-display font-light leading-none text-kupfer/25 md:w-32 md:shrink-0"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className={cn('max-w-xl', rechts && 'md:ml-auto')}>
                <h3 className="text-heading font-light text-carbon-warm">{p.titel}</h3>
                <p className="mt-4 text-body text-text-muted">{p.text}</p>
              </div>
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}
