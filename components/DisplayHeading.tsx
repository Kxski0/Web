import { cn } from '@/lib/cn';

/**
 * Display-Ueberschrift: Gewicht 300, Zeilenhoehe 1.0.
 *
 * Die wichtigste typografische Entscheidung des Systems. Niemals fett oder
 * halbfett setzen — die Fluesterschrift ist der ganze Punkt.
 *
 * `enthuellen` legt die Zeile in eine Maske, aus der sie beim Eintritt ins
 * Bild nach oben hereinfaehrt. Das setzt eine <Reveal>-Huelle voraus, die
 * data-sichtbar setzt; ohne JavaScript und bei prefers-reduced-motion steht
 * die Ueberschrift sofort da.
 */
export function DisplayHeading({
  as: Tag = 'h2',
  children,
  inverse = false,
  enthuellen = false,
  className,
}: {
  as?: 'h1' | 'h2' | 'h3';
  children: React.ReactNode;
  inverse?: boolean;
  enthuellen?: boolean;
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        'text-display font-light text-balance',
        inverse ? 'text-paper-white' : 'text-carbon-warm',
        className,
      )}
    >
      {enthuellen ? (
        <span className="zeile">
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </Tag>
  );
}
