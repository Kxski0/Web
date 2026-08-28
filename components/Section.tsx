import { cn } from '@/lib/cn';
import { SectionLabel } from './SectionLabel';

/**
 * Standard-Sektion: zentrierter Inhalt bis 1200px, grosszuegige Innenabstaende.
 *
 * Die Vorgabe nennt 48px Sektionsabstand bei "grosszuegigem inneren Atem" —
 * daher 48px zwischen den Sektionen und 96px vertikaler Innenabstand.
 */
export function Section({
  label,
  labelAs,
  children,
  className,
  surface = 'vellum',
  id,
}: {
  label?: string;
  /** 'h2', wenn das Label die Sektion inhaltlich benennt. */
  labelAs?: 'p' | 'h2';
  children: React.ReactNode;
  className?: string;
  surface?: 'vellum' | 'white';
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        'py-24',
        surface === 'white' ? 'bg-paper-white' : 'bg-vellum',
        className,
      )}
    >
      <div className="container-page">
        {label ? (
          <SectionLabel as={labelAs} className="mb-6">
            {label}
          </SectionLabel>
        ) : null}
        {children}
      </div>
    </section>
  );
}
