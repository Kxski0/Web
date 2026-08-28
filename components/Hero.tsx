import { DisplayHeading } from './DisplayHeading';
import { Bild } from './Bild';
import { media } from '@/content/media';
import { cn } from '@/lib/cn';

/**
 * Vollflaechiger Hero: Bildebene ueber die gesamte Breite, Text unten links.
 *
 * Abweichung von der Vorgabe (dort: "kein Verlauf, keine Abdunklung"):
 * Ein Verlauf liegt hinter dem Textblock. Die Bildebene ist austauschbar —
 * duenner weisser Text in Gewicht 300 waere auf einem hellen Motiv
 * unlesbar. Der Verlauf ist die einzige Loesung, die unabhaengig vom Motiv
 * traegt; er bleibt schwach genug, dass der Charakter des Bildes erhalten
 * bleibt.
 *
 * Die Ueberschrift tritt zeilenweise ein, Subline und Buttons folgen
 * versetzt — die Regeln dazu stehen in globals.css und fallen bei
 * prefers-reduced-motion weg.
 */
export function Hero({
  headline,
  subline,
  children,
  className,
}: {
  /** Je Eintrag eine Zeile, die einzeln enthuellt wird. */
  headline: string[];
  subline?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'surface-dark relative flex min-h-[88svh] items-end overflow-hidden',
        className,
      )}
    >
      <Bild szene="hero" foto={media.hero.foto} fuellend sofort priority sizes="100vw" />

      {/* Lesbarkeitsverlauf — siehe Kommentar oben. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-onyx-depth/70 via-onyx-depth/25 to-transparent"
      />

      <div className="container-page auftritt relative w-full pb-24 pt-40">
        <DisplayHeading as="h1" inverse className="max-w-3xl">
          {headline.map((zeile) => (
            <span key={zeile} className="zeile">
              <span>{zeile}</span>
            </span>
          ))}
        </DisplayHeading>

        {subline ? (
          <p className="mt-6 max-w-xl text-body text-paper-white/80">{subline}</p>
        ) : null}

        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
