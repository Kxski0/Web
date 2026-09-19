'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { STAGES } from '@/content/stages';
import styles from './Stages.module.css';

/** Scrollweg je Phase, in Prozent der Bildhöhe. */
const SCROLL_PER_STAGE = 60;

const HEAD = {
  eyebrow: 'Von Anfang an',
  title: 'Von Frühchengröße bis Schulkind.',
};

/**
 * Der Signature-Abschnitt der Startseite.
 *
 * Er zeigt, welche Phase der Laden abdeckt, und ist damit inhaltlich nützlich
 * statt nur dekorativ — die Frage „habt ihr auch Größe 50?“ wird hier
 * beantwortet, bevor sie gestellt wird.
 *
 * Technik bewusst schlicht: kein GSAP-Pinning, sondern `position: sticky` und
 * ein auf einen Frame gedrosselter Scroll-Handler, der die Scrollposition in
 * einen Phasenindex auflöst. Alles Sichtbare läuft danach über
 * CSS-Transitions. Das ist billiger als eine Zeitleiste, die an den Scroll
 * gekoppelt wird, und es kann nicht aus dem Tritt geraten.
 *
 * Bei `prefers-reduced-motion` wird ein anderer Baum gerendert: alle Phasen
 * gleichzeitig, untereinander, ohne Pinning. Deshalb useReducedMotion und
 * nicht bloß eine übersprungene Animation — hier unterscheidet sich das
 * Markup, nicht nur die Bewegung.
 */
export function Stages() {
  const reduced = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const node = track.current;
    if (!node) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = node.getBoundingClientRect();
        // Wie weit ist die Bahn durchlaufen, von 0 bis 1?
        const scrollable = rect.height - window.innerHeight;
        if (scrollable <= 0) return;
        const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
        // Die letzte Phase soll stehen bleiben, statt am Ende durchzurutschen.
        setActive(Math.min(Math.floor(progress * STAGES.length), STAGES.length - 1));
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <section className={`${styles.section} ${styles.static}`} id="phasen">
        <div className="page-bounds">
          <div className={styles.head}>
            <Eyebrow index="04">{HEAD.eyebrow}</Eyebrow>
            <h2 className={styles.title}>{HEAD.title}</h2>
          </div>
          <ul className={styles.staticList}>
            {STAGES.map((stage) => (
              <li key={stage.id} className={styles.staticItem}>
                <p className={styles.size}>{stage.size}</p>
                <h3 className={styles.phaseTitle}>{stage.title}</h3>
                <p className={styles.phaseBody}>{stage.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} id="phasen">
      <div
        ref={track}
        className={styles.track}
        // Eine Bildhöhe für die gepinnte Ansicht selbst, dazu SCROLL_PER_STAGE
        // je Phase als Weg, über den der Fortschritt läuft.
        style={{ height: `${100 + STAGES.length * SCROLL_PER_STAGE}svh` }}
      >
        <div className={styles.stage}>
          <div className={`${styles.inner} page-bounds`}>
            <div className={styles.head}>
              <Eyebrow index="04">{HEAD.eyebrow}</Eyebrow>
              <h2 className={styles.title}>{HEAD.title}</h2>
            </div>

            <ul className={styles.rail}>
              {STAGES.map((stage, i) => (
                <li key={stage.id} className={styles.railItem} data-active={i === active}>
                  {stage.label}
                </li>
              ))}
            </ul>

            <div className={styles.panel}>
              {STAGES.map((stage, i) => (
                <div
                  key={stage.id}
                  className={styles.phase}
                  data-active={i === active}
                  /*
                   * Bewusst ohne aria-hidden: die sechs Phasen sind hier
                   * übereinandergelegt, aber inhaltlich eine Liste. Wer sie
                   * vorgelesen bekommt, bekommt sie vollständig vorgelesen,
                   * statt auf das Scrollen angewiesen zu sein. Sichtbar ist
                   * trotzdem immer nur eine; fokussierbaren Inhalt gibt es
                   * darin nicht, also entsteht daraus keine Fokusfalle.
                   */
                >
                  <p className={styles.size}>{stage.size}</p>
                  <h3 className={styles.phaseTitle}>{stage.title}</h3>
                  <p className={styles.phaseBody}>{stage.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
