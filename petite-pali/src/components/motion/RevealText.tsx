'use client';

import { useGSAP } from '@gsap/react';
import { useRef, type ElementType, type ReactNode } from 'react';
import { REVEAL, SplitText, gsap, prefersReducedMotion } from '@/lib/gsap';

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  /** 'load' startet sofort, 'scroll' wartet, bis der Block im Bild ist. */
  on?: 'load' | 'scroll';
};

/**
 * Zeilenweise Maskeneinblendung: jede Zeile fährt aus ihrem eigenen
 * Beschnittkasten hoch, statt einzublenden. `mask` baut den Überlaufrahmen,
 * `autoSplit` teilt nach dem Laden der Webschrift und bei Größenänderung neu,
 * damit die Maske nie die falsche Zeile abschneidet.
 *
 * Läuft kein JavaScript, steht der Text einfach lesbar da.
 */
export function RevealText({ as: Tag = 'div', children, className, delay = 0, on = 'scroll' }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 100,
            duration: REVEAL.duration,
            ease: REVEAL.ease,
            stagger: REVEAL.stagger,
            delay,
            scrollTrigger: on === 'scroll' ? { trigger: el, start: 'top 88%', once: true } : undefined,
          });
        },
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [on, delay] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
