'use client';

import { useEffect, useRef, useState } from 'react';
import { prozess } from '@/content/prozess';
import { ProzessGrafik } from './ProzessGrafik';
import { cn } from '@/lib/cn';

/**
 * Scroll-getriebene Darstellung von "Vom Potenzial zur Loesung".
 *
 * Auf Desktop bleibt die Grafik stehen, waehrend die Schritte daran
 * vorbeilaufen; der jeweils aktive Schritt zeichnet die naechste Ebene der
 * Grafik. Auf schmalen Viewports wird die Sequenz zu einer schlichten Liste
 * mit einer einzelnen, vollstaendigen Grafik darueber — sticky Scrollytelling
 * auf dem Handy kostet mehr, als es bringt.
 */
export function ProzessSequenz() {
  const [aktiv, setAktiv] = useState(0);
  const schritte = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (eintraege) => {
        eintraege.forEach((e) => {
          if (!e.isIntersecting) return;
          const index = Number((e.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) setAktiv(index);
        });
      },
      // Schmales Band in der Bildschirmmitte: Der Schritt gilt als aktiv,
      // sobald er dort ankommt.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    schritte.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-12 md:grid-cols-2 md:gap-16">
      {/* Grafik — auf Desktop stehend, auf Mobil einmal oben */}
      <div className="md:sticky md:top-32 md:self-start">
        <div className="mx-auto max-w-sm text-carbon-warm md:max-w-none">
          <ProzessGrafik stufe={aktiv} />
        </div>
      </div>

      <ol className="md:py-[20vh]">
        {prozess.map((s, i) => (
          <li
            key={s.nummer}
            data-index={i}
            ref={(el) => {
              schritte.current[i] = el;
            }}
            className="border-t border-hairline py-8 last:border-b md:min-h-[42vh] md:py-12"
          >
            {/*
              Die Hierarchie laeuft ueber die Farbstufen des Systems, nicht
              ueber Deckkraft: Ein abgedunkelter Schritt bei 35 % waere zwar
              ein schoener Fokuseffekt, aber schlicht nicht mehr lesbar.
              Inaktiv steht auf text-muted (rund 7:1), aktiv auf vollem
              Carbon (11.8:1) — beide bestehen WCAG AA.
            */}
            <div
              className={cn(
                'transition-colors duration-500 motion-reduce:transition-none',
                aktiv === i ? 'text-carbon-warm' : 'text-text-muted',
              )}
            >
              <p className="text-label uppercase tracking-[0.12em]">{s.nummer}</p>
              <h3 className="mt-3 text-heading font-light">{s.titel}</h3>
              <p className="mt-4 max-w-md text-body">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
