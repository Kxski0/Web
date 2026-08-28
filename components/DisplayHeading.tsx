import { cn } from '@/lib/cn';

/**
 * Display-Ueberschrift: Gewicht 300, Zeilenhoehe 1.0.
 *
 * Die wichtigste typografische Entscheidung des Systems. Niemals fett oder
 * halbfett setzen — die Fluesterschrift ist der ganze Punkt.
 */
export function DisplayHeading({
  as: Tag = 'h2',
  children,
  inverse = false,
  className,
}: {
  as?: 'h1' | 'h2' | 'h3';
  children: React.ReactNode;
  inverse?: boolean;
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
      {children}
    </Tag>
  );
}
