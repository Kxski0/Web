import { cn } from '@/lib/cn';

/**
 * Wortmarke.
 *
 * Vorlaeufig: Sobald eine echte Wortmarke von EnergieSaar vorliegt, wird
 * dieses Textzeichen dagegen ausgetauscht. Der Gewichtssprung 300 → 400
 * arbeitet ausschliesslich mit den beiden Schnitten, die das System kennt,
 * und kommt ohne zweite Farbe aus.
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
        'text-body-sm tracking-[0.02em] whitespace-nowrap',
        inverse ? 'text-paper-white' : 'text-carbon-warm',
        className,
      )}
    >
      <span className="font-light">Energie</span>
      <span className="font-normal">Saar</span>
    </span>
  );
}
