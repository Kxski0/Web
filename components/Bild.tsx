'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import {
  SzeneBau,
  SzeneEnergieberatung,
  SzeneHero,
  SzeneImmobilien,
  SzeneLicht,
  SzenePhotovoltaik,
  SzeneTarife,
  SzeneUnternehmen,
  SzeneWaerme,
} from './szenen';

export const szenen = {
  hero: SzeneHero,
  photovoltaik: SzenePhotovoltaik,
  energieberatung: SzeneEnergieberatung,
  waerme: SzeneWaerme,
  bau: SzeneBau,
  immobilien: SzeneImmobilien,
  unternehmen: SzeneUnternehmen,
  tarife: SzeneTarife,
  licht: SzeneLicht,
} as const;

export type SzenenName = keyof typeof szenen;

/**
 * Bildcontainer mit dem markanten Radius — die dritte Signatur des Systems.
 *
 * Nimmt entweder eine gezeichnete Szene (`szene`) oder ein echtes Foto
 * (`src`). Solange keine Fotos vorliegen, tragen die Szenen die Bildebene;
 * der Wechsel auf Fotos ist ein Austausch der Prop.
 *
 * Beim Eintritt ins Bild laeuft eine Enthuellung: Die Maske gibt den Inhalt
 * von unten nach oben frei, das Motiv faehrt aus einer leichten
 * Ueberzeichnung in seine Endgroesse, und das Linienwerk der Szene wird
 * gezeichnet. Bei prefers-reduced-motion entfaellt das vollstaendig — die
 * Regeln dazu stehen in globals.css.
 *
 * Wichtig: Die Maske liegt auf einem INNEREN Element, nicht auf dem
 * beobachteten Container. clip-path fliesst in die Berechnung des
 * IntersectionObserver ein — laege die Maske aussen, meldete das
 * zugeklappte Bild nie "sichtbar" und bliebe damit fuer immer zu.
 */
export function Bild({
  szene,
  src,
  alt = '',
  className,
  aspect = 'aspect-[4/3]',
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
}: {
  szene?: SzenenName;
  src?: string;
  /** Leerer String nur fuer rein dekorative Bilder. */
  alt?: string;
  className?: string;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [sichtbar, setSichtbar] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([eintrag]) => {
        if (eintrag.isIntersecting) {
          setSichtbar(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Szene = szene ? szenen[szene] : null;

  return (
    <div
      ref={ref}
      data-sichtbar={sichtbar ? 'true' : undefined}
      className={cn('bild relative w-full', aspect, className)}
    >
      <div className="bildmaske absolute inset-0 overflow-hidden rounded-[var(--radius-image)] bg-[color-mix(in_srgb,var(--color-carbon-warm)_8%,var(--color-vellum))]">
        {Szene ? (
          <Szene className="szene absolute inset-0 h-full w-full" />
        ) : src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="szene object-cover"
          />
        ) : null}
      </div>
    </div>
  );
}
