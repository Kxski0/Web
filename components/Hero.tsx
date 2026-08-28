import Image from 'next/image';
import { DisplayHeading } from './DisplayHeading';
import { cn } from '@/lib/cn';

/**
 * Vollflaechiger Hero: Foto ueber die gesamte Breite, Text unten links.
 *
 * Abweichung von der Vorgabe (dort: "kein Verlauf, keine Abdunklung"):
 * Ein sehr schwacher Verlauf liegt hinter dem Textblock. Die Bilder kommen
 * direkt von Unsplash und sind jederzeit austauschbar — der Tonwert unten
 * links ist damit nicht dauerhaft kontrollierbar, und duenner weisser Text
 * in Gewicht 300 auf hellem Himmel waere unlesbar. Der Verlauf ist die
 * einzige Loesung, die unabhaengig vom konkreten Bild traegt; er bleibt
 * schwach genug, dass der Fotocharakter erhalten bleibt.
 */
export function Hero({
  src,
  alt,
  headline,
  children,
  className,
}: {
  src: string;
  alt: string;
  headline: React.ReactNode;
  /** Buttons oder Karten unterhalb der Ueberschrift. */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'surface-dark relative flex min-h-[85svh] items-end overflow-hidden',
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Lesbarkeitsverlauf — siehe Kommentar oben. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-onyx-depth/45 to-transparent"
      />

      <div className="container-page relative w-full pb-24 pt-40">
        <DisplayHeading as="h1" inverse className="max-w-3xl">
          {headline}
        </DisplayHeading>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
