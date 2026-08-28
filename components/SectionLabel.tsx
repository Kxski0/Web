import { cn } from '@/lib/cn';

/**
 * Section-Label mit dem 4px-Quadrat davor.
 *
 * Das Quadrat ist eine der drei Signaturen des Systems und ersetzt bewusst
 * Bullet oder Icon. Es steht vor jedem Label — ohne Ausnahme.
 */
export function SectionLabel({
  children,
  inverse = false,
  className,
}: {
  children: React.ReactNode;
  /** Auf dunklen Flaechen (Carbon, Onyx). */
  inverse?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'flex items-center text-label font-normal uppercase',
        inverse ? 'text-paper-white' : 'text-carbon-warm',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'mr-2 inline-block size-1 shrink-0',
          inverse ? 'bg-paper-white' : 'bg-carbon-warm',
        )}
      />
      {children}
    </p>
  );
}
