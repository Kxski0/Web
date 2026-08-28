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
 * Zeigt ein Foto, wenn eines hinterlegt ist, und faellt sonst auf die
 * gezeichnete Szene zurueck. Der Rueckfall greift auch, wenn das Foto nicht
 * laedt: Die Foto-URLs stammen von Unsplash und lassen sich aus der
 * Entwicklungsumgebung nicht pruefen (kein Bildhost erreichbar). Statt eines
 * kaputten Bildes erscheint dann die Szene — sichtbar wird der Unterschied
 * nur daran, dass eine Zeichnung statt eines Fotos steht.
 *
 * Beim Eintritt ins Bild laeuft eine Enthuellung: Die Maske gibt den Inhalt
 * von unten nach oben frei, das Motiv faehrt aus einer leichten
 * Ueberzeichnung in seine Endgroesse, und das Linienwerk einer Szene wird
 * gezeichnet.
 *
 * Wichtig: Die Maske liegt auf einem INNEREN Element, nicht auf dem
 * beobachteten Container. clip-path fliesst in die Berechnung des
 * IntersectionObserver ein — laege die Maske aussen, meldete das
 * zugeklappte Bild nie "sichtbar" und bliebe damit fuer immer zu.
 */
export function Bild({
  szene,
  foto,
  alt = '',
  className,
  aspect = 'aspect-[4/3]',
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  fuellend = false,
  sofort = false,
}: {
  szene: SzenenName;
  /** Unsplash-URL oder lokaler Pfad. Faellt bei Fehler auf die Szene zurueck. */
  foto?: string;
  /** Leerer String nur fuer rein dekorative Bilder. */
  alt?: string;
  className?: string;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  /** Fuellt den Elternbereich statt ein Seitenverhaeltnis vorzugeben (Hero). */
  fuellend?: boolean;
  /** Ohne Enthuellung sofort sichtbar (Hero). */
  sofort?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [sichtbar, setSichtbar] = useState(sofort);
  const [fotoKaputt, setFotoKaputt] = useState(false);

  useEffect(() => {
    if (sofort) return;
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
  }, [sofort]);

  const Szene = szenen[szene];
  const zeigeFoto = Boolean(foto) && !fotoKaputt;

  return (
    <div
      ref={ref}
      data-sichtbar={sichtbar ? 'true' : undefined}
      className={cn(
        'bild',
        fuellend ? 'absolute inset-0' : cn('relative w-full', aspect),
        className,
      )}
    >
      <div
        className={cn(
          'bildmaske absolute inset-0 overflow-hidden bg-[color-mix(in_srgb,var(--color-carbon-warm)_8%,var(--color-vellum))]',
          fuellend ? 'rounded-none' : 'rounded-[var(--radius-image)]',
        )}
      >
        {/*
          Die Szene liegt immer darunter. Faellt das Foto aus, steht sofort
          etwas da — es blitzt keine leere Flaeche auf.
        */}
        <Szene className="szene absolute inset-0 h-full w-full" />

        {zeigeFoto ? (
          <Image
            src={foto as string}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            onError={() => setFotoKaputt(true)}
            className="szene object-cover"
          />
        ) : null}
      </div>
    </div>
  );
}
