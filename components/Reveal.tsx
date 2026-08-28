'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Blendet Inhalt beim Scrollen ein.
 *
 * Ohne Animationsbibliothek: ein IntersectionObserver plus eine CSS-Transition.
 *
 * Wichtig: Der versteckte Startzustand steckt in globals.css und greift nur
 * unter [data-js='true']. Faellt JavaScript aus, bleibt der Inhalt sichtbar,
 * statt dauerhaft auf opacity 0 zu stehen. Nutzer mit prefers-reduced-motion
 * bekommen den Inhalt ebenfalls sofort.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
}: {
  children: React.ReactNode;
  /** Verzoegerung in Millisekunden, fuer gestaffelte Gruppen. */
  delay?: number;
  as?: 'div' | 'li' | 'section';
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
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
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn('reveal', className)}
      data-sichtbar={sichtbar ? 'true' : undefined}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
