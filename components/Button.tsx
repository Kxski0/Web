import Link from 'next/link';
import { cn } from '@/lib/cn';

type Variant = 'filled' | 'ghost' | 'invers' | 'ghostInvers';

/**
 * Button in zwei Varianten — ein aufeinander abgestimmtes Paar, das sich nur
 * in der Fuellung unterscheidet.
 *
 * Radius: 100px (volle Pille). Die Radius-Tabelle der Vorgabe nennt 16px,
 * saemtliche Komponentenbeschreibungen und Beispiele aber 100px.
 *
 * Zustaende sind in der Vorgabe nicht definiert. Ohne Farben und ohne
 * Schatten bleiben nur Fuellungstausch und Deckkraft:
 *   filled → Hover wechselt Carbon auf Onyx
 *   ghost  → Hover fuellt sich mit Carbon, wird also zum Zwilling
 *
 * Fuer dunkle Flaechen gibt es eigene Varianten statt Ueberschreibungen per
 * className: Konkurrieren zwei Tailwind-Utilities fuer dieselbe Eigenschaft,
 * entscheidet die Reihenfolge im erzeugten Stylesheet und nicht die im
 * Attribut. Genau daran ist der Abschluss-CTA einmal unsichtbar geworden
 * (weisse Schrift auf weisser Flaeche) — deshalb hier explizite Varianten.
 */
const base =
  'inline-flex items-center justify-center rounded-[var(--radius-pill)] ' +
  'px-[22px] py-[18px] text-body-sm font-normal box-border ' +
  'transition-colors duration-200 ' +
  'disabled:pointer-events-none disabled:text-mercury disabled:border-mercury';

const variants: Record<Variant, string> = {
  filled:
    'border border-transparent bg-carbon-warm text-paper-white hover:bg-onyx-depth',
  ghost:
    'border border-carbon-warm bg-transparent text-carbon-warm ' +
    'hover:bg-carbon-warm hover:text-paper-white',
  // Auf dunklen Flaechen: helle Fuellung, dunkle Schrift.
  invers:
    'border border-transparent bg-paper-white text-carbon-warm hover:bg-vellum',
  ghostInvers:
    'border border-paper-white bg-transparent text-paper-white ' +
    'hover:bg-paper-white hover:text-carbon-warm',
};

type CommonProps = {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
};

export function Button({
  href,
  variant = 'filled',
  children,
  className,
  ...rest
}: CommonProps & { href: string } & Omit<
    React.ComponentPropsWithoutRef<typeof Link>,
    'href' | 'className' | 'children'
  >) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </Link>
  );
}

export function ButtonAction({
  variant = 'filled',
  children,
  className,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
