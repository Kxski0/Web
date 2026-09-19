'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Meldet einmalig, wenn ein Element ins Bild kommt — für Einblendungen, die
 * beim Hineinscrollen starten sollen statt beim Laden.
 *
 * Bewusst einmalig: etwas, das bei jedem Vorbeiscrollen erneut einblendet,
 * wird beim zweiten Mal zur Störung.
 *
 * Der Startwert ist `false`, der Ruhezustand im CSS aber der sichtbare. Fällt
 * JavaScript aus oder kennt der Browser den IntersectionObserver nicht, bleibt
 * der Inhalt sichtbar — eine Einblendung darf nie darüber entscheiden, ob
 * etwas lesbar ist.
 */
export function useInViewOnce<T extends HTMLElement>(rootMargin = '-12% 0px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
