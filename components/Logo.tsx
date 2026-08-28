import { cn } from '@/lib/cn';

/**
 * Wortmarke Energie Zentrum Saar.
 *
 * Vorlaeufig, solange keine gestaltete Marke vorliegt. Der Gewichtssprung
 * 300 → 400 auf "Saar" arbeitet ausschliesslich mit den beiden Schnitten,
 * die das System kennt, und kommt ohne zweite Farbe aus.
 */
export function Logo({
  inverse = false,
  className,
}: {
  inverse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'whitespace-nowrap text-body-sm tracking-[0.02em]',
        inverse ? 'text-paper-white' : 'text-carbon-warm',
        className,
      )}
    >
      <span className="font-light">Energie Zentrum </span>
      <span className="font-normal">Saar</span>
    </span>
  );
}
