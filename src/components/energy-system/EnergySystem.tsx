'use client';

import { useEffect, useRef, useState } from 'react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { HouseDiagram } from './HouseDiagram';
import { PHASES, layersFor } from './phases';
import styles from './EnergySystem.module.css';

/**
 * The signature moment: a house assembling itself into an energy system as the
 * reader scrolls.
 *
 * Pinning is `position: sticky`, not a scroll library. Sticky is native, adds no
 * transform layer, survives resize without a refresh call and cannot desync from
 * the scrollbar — a pinning plugin here would be machinery for a problem the
 * platform already solved. Scroll position only ever resolves to a phase INDEX;
 * every visual change is a CSS transition, so the work happens off the main
 * thread and the states stay crisp rather than smearing under a scrub.
 *
 * Accessibility: the phases are real content, not animation. They render as a
 * list that is fully readable with no scrolling, no JavaScript and no motion —
 * the pinned choreography is an enhancement layered on top of it (§41).
 */
export function EnergySystem() {
  const section = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const node = section.current;
    if (!node) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;

      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      // The last phase gets the same share of scroll as the others, so the
      // finished system is not a single frame before the section releases.
      const next = Math.min(Math.floor(progress * PHASES.length), PHASES.length - 1);
      setPhase((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  const active = PHASES[phase];
  const visible = layersFor(reducedMotion ? 'all' : phase);

  return (
    <section
      ref={section}
      id="system"
      className={`${styles.section} grain`}
      data-reduced={reducedMotion}
      aria-labelledby="system-headline"
      style={{ '--phase-count': PHASES.length } as React.CSSProperties}
    >
      <div className={styles.sticky}>
        <div className={`${styles.inner} page-grid`}>
          <div className={styles.intro}>
            <Eyebrow index="03">Das System</Eyebrow>
            <h2 id="system-headline" className={styles.headline}>
              Nicht ein Produkt.
              <br />
              Ein System.
            </h2>

            {/*
              Progress rail. This is the reason the section is not
              animation-only: it names every phase in text and marks the current
              one, so the sequence is followable without seeing it move.
            */}
            <ol className={styles.rail} aria-label="Phasen des Energiesystems">
              {PHASES.map((item, index) => (
                <li
                  key={item.id}
                  className={styles.railItem}
                  data-active={!reducedMotion && index === phase}
                  data-passed={!reducedMotion && index < phase}
                  aria-current={!reducedMotion && index === phase ? 'step' : undefined}
                >
                  <span className={styles.railTick} aria-hidden="true" />
                  <span className={styles.railIndex}>{item.index}</span>
                  <span className={styles.railLabel}>{item.label}</span>
                </li>
              ))}
            </ol>

            {/* Same information, laid out for a narrow column. */}
            <div className={styles.railCompact} aria-hidden="true">
              <span className={styles.railCompactCount}>
                {active.index} / {String(PHASES.length).padStart(2, '0')}
              </span>
              <span className={styles.railCompactTicks}>
                {PHASES.map((item, index) => (
                  <span
                    key={item.id}
                    className={styles.railCompactTick}
                    data-active={!reducedMotion && index === phase}
                    data-passed={!reducedMotion && index < phase}
                  />
                ))}
              </span>
            </div>
          </div>

          <div className={styles.stage}>
            <HouseDiagram visible={visible} stillFlow={reducedMotion} />
          </div>

          {/*
            Live copy for the scrolled experience. Hidden from assistive tech
            because the same seven blocks are exposed in full below, where they
            can be read in order instead of one at a time.
          */}
          {!reducedMotion && (
            <div className={styles.caption} aria-hidden="true" key={active.id}>
              <p className={styles.captionIndex}>{active.index}</p>
              <h3 className={styles.captionTitle}>{active.title}</h3>
              <p className={styles.captionBody}>{active.body}</p>
            </div>
          )}
        </div>
      </div>

      {/* The full sequence as ordinary prose: the source of truth for readers,
          search engines and anyone who never sees the pinned version. */}
      <div className={styles.transcript} data-visual-hidden={!reducedMotion}>
        <div className="page-bounds">
          <ol className={styles.transcriptList}>
            {PHASES.map((item) => (
              <li key={item.id} className={styles.transcriptItem}>
                <p className={styles.captionIndex}>{item.index}</p>
                <h3 className={styles.captionTitle}>{item.title}</h3>
                <p className={styles.captionBody}>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
