'use client';

import { useEffect, useRef } from 'react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { PROCESS } from '@/content/process';
import styles from './Process.module.css';

/**
 * Section 06 — the five steps of an engagement.
 *
 * Horizontal on wide screens, vertical on narrow ones, as the brief asks. The
 * mechanic is deliberately different from the energy system's: that section
 * steps between discrete states, this one translates continuously, so the two
 * pinned passages do not read as the same trick twice.
 *
 * The transform is written straight onto the track element rather than through a
 * custom property on a parent. A variable change on a parent recalculates styles
 * for every child; a direct transform touches one node.
 */
export function Process() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const node = section.current;
    const rail = track.current;
    if (!node || !rail) return;

    // Below the breakpoint the panels stack, and no transform should apply.
    const wide = window.matchMedia('(min-width: 64rem)');
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!wide.matches) {
        rail.style.transform = '';
        return;
      }
      const rect = node.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const travel = rail.scrollWidth - rail.clientWidth;
      if (scrollable <= 0 || travel <= 0) return;

      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      rail.style.transform = `translate3d(${-progress * travel}px, 0, 0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    wide.addEventListener('change', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      wide.removeEventListener('change', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={section}
      id="ablauf"
      className={styles.section}
      data-reduced={reducedMotion}
      aria-labelledby="process-headline"
      style={{ '--step-count': PROCESS.length } as React.CSSProperties}
    >
      <div className={styles.sticky}>
        <div className={`${styles.head} page-bounds`}>
          <Eyebrow index="06">Ablauf</Eyebrow>
          <h2 id="process-headline" className={styles.headline}>
            Fünf Schritte, in dieser Reihenfolge.
          </h2>
        </div>

        <div className={styles.viewport}>
          <ol ref={track} className={styles.track}>
            {PROCESS.map((step) => (
              <li key={step.index} className={styles.panel}>
                <p className={styles.panelIndex}>{step.index}</p>
                <h3 className={styles.panelLabel}>{step.label}</h3>
                <p className={styles.panelBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
