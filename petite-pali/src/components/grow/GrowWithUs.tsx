'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Stagger } from '@/components/motion/Stagger';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { GROW_LADDER, GROW_STEPS } from '@/content/grow';
import styles from './GrowWithUs.module.css';

const HEAD = {
  label: 'Von 44 bis 122',
  title: 'Kinder wachsen. Der Laden wächst mit.',
};

/** Scrollweg je Abschnitt, in Prozent der Bildhöhe. */
const SCROLL_PER_STEP = 62;

/**
 * Der Signature-Abschnitt: die Größenleiter des Ladens, beim Scrollen
 * durchlaufen.
 *
 * Er ist nicht bloß Dekoration — er beantwortet die Frage, die im Laden am
 * häufigsten gestellt wird: „Habt ihr das auch in Größe …?" Und er zeigt, was
 * die Boutique von einem Babyladen unterscheidet: sie deckt die ganze Strecke
 * ab, von Frühchengröße 44 bis zur Grundschule.
 *
 * Technik bewusst schlicht: kein GSAP-Pinning, sondern `position: sticky` und
 * ein auf einen Frame gedrosselter Scroll-Handler, der die Scrollposition in
 * einen Index auflöst. Alles Sichtbare läuft danach über CSS-Transitions. Das
 * ist billiger als eine an den Scroll gekoppelte Zeitleiste und kann nicht aus
 * dem Tritt geraten.
 *
 * Bei `prefers-reduced-motion` wird ein anderer Baum gerendert: alle
 * Abschnitte untereinander, ohne Pinning. Deshalb useReducedMotion und nicht
 * nur eine übersprungene Animation — hier unterscheidet sich das Markup.
 */
export function GrowWithUs() {
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
        const scrollable = rect.height - window.innerHeight;
        if (scrollable <= 0) return;
        const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
        setActive(Math.min(Math.floor(progress * GROW_STEPS.length), GROW_STEPS.length - 1));
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

  const Head = (
    <div className={styles.head}>
      <p className={styles.label}>
        <span className={styles.rule} aria-hidden="true" />
        {HEAD.label}
      </p>
      <h2 className={styles.title}>{HEAD.title}</h2>
    </div>
  );

  if (reduced) {
    return (
      <section className={`${styles.section} ${styles.static}`} id="groessen">
        <div className="page-bounds">
          {Head}
          <Stagger as="ol" className={styles.staticList}>
            {GROW_STEPS.map((step, i) => (
              <li
                key={step.size}
                className={styles.staticItem}
                style={{ '--i': i } as React.CSSProperties}
              >
                <p className={styles.staticSize}>
                  {step.size}
                  <span className={styles.sizeUnit}>Größe</span>
                </p>
                <div>
                  <h3 className={styles.phase} style={{ marginTop: 0 }}>
                    {step.phase}
                  </h3>
                  <p className={styles.line}>{step.line}</p>
                </div>
              </li>
            ))}
          </Stagger>
        </div>
      </section>
    );
  }

  const current = GROW_STEPS[active];

  return (
    <section className={styles.section} id="groessen">
      <div
        ref={track}
        className={styles.track}
        style={{ height: `${100 + GROW_STEPS.length * SCROLL_PER_STEP}svh` }}
      >
        <div className={styles.stage}>
          <div className={`${styles.inner} page-bounds`}>
            <div className={styles.figure}>
              {GROW_STEPS.map((step, i) => (
                <div key={step.size} className={styles.shot} data-active={i === active}>
                  <Image
                    src={step.image.src}
                    alt=""
                    // Der Alternativtext steht in der ausgeschriebenen Fassung
                    // und in der Galerie; hier ist das Bild Begleitung zum Text
                    // daneben und würde doppelt vorgelesen.
                    aria-hidden="true"
                    width={step.image.width}
                    height={step.image.height}
                    sizes="(min-width: 62rem) 46vw, 92vw"
                    style={{ objectPosition: step.image.focus }}
                  />
                </div>
              ))}
            </div>

            <div className={styles.panel}>
              <p className={styles.label}>
                <span className={styles.rule} aria-hidden="true" />
                {HEAD.label}
              </p>

              <div className={styles.steps}>
                {GROW_STEPS.map((step, i) => (
                  /*
                   * Bewusst ohne aria-hidden: die Abschnitte liegen
                   * übereinander, sind inhaltlich aber eine Liste. Wer sie
                   * vorgelesen bekommt, bekommt sie vollständig — statt auf das
                   * Scrollen angewiesen zu sein. Fokussierbaren Inhalt gibt es
                   * darin nicht, also entsteht keine Fokusfalle.
                   */
                  <div key={step.size} className={styles.step} data-active={i === active}>
                    <p className={styles.size}>
                      {step.size}
                      <span className={styles.sizeUnit}>Größe</span>
                    </p>
                    <h3 className={styles.phase}>{step.phase}</h3>
                    <p className={styles.line}>{step.line}</p>
                  </div>
                ))}
              </div>

              <ul className={styles.ladder} aria-hidden="true">
                {GROW_LADDER.map((size) => (
                  <li
                    key={size}
                    className={styles.rung}
                    data-passed={size <= current.size}
                    data-current={size === current.size}
                  >
                    {size}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
