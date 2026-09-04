'use client';

import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { REVEAL, ScrollTrigger, gsap, prefersReducedMotion } from '@/lib/gsap';
import { HeroMedia } from './HeroMedia';
import styles from './Hero.module.css';

export function Hero() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = section.current;
      if (!root || prefersReducedMotion()) return;

      const parallax = root.querySelector<HTMLElement>('[data-hero-parallax]');
      const image = root.querySelector<HTMLElement>('[data-hero-image]');
      const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line] > span');
      const supporting = root.querySelectorAll<HTMLElement>('[data-hero-fade]');
      const text = root.querySelector<HTMLElement>('[data-hero-text]');

      // --- Entrance -------------------------------------------------------
      const intro = gsap.timeline({ defaults: { ease: REVEAL.ease } });

      if (image) {
        // Settling out of a slight over-scale. 1.04 reads as movement; anything
        // larger turns the photograph into an effect.
        intro.from(image, { scale: 1.04, duration: 1.4 }, 0);
      }

      // Each line rides up out of its own mask rather than fading in (§28).
      intro.from(
        lines,
        { yPercent: 100, duration: REVEAL.duration, stagger: REVEAL.stagger },
        0.15,
      );

      intro.from(
        supporting,
        { y: 18, opacity: 0, duration: 0.6, stagger: 0.08 },
        0.15 + REVEAL.stagger * lines.length,
      );

      // --- Depth on scroll -------------------------------------------------
      // Both layers lag behind the scroll, the photograph more than the words,
      // so the frame gains depth instead of sliding as one flat plane (§30).
      if (parallax) {
        gsap.to(parallax, {
          yPercent: 16,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      }

      if (text) {
        gsap.to(text, {
          y: () => window.innerHeight * 0.09,
          opacity: 0.12,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      }

      // Fonts and images both land after first paint and both change layout.
      // Without a refresh, every reveal below the fold is measured against
      // stale offsets and can sit clipped at the wrong scroll position.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      if (document.readyState === 'complete') {
        ScrollTrigger.refresh();
      } else {
        window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
      }
    },
    { scope: section },
  );

  return (
    <section ref={section} className={`${styles.hero} grain`} aria-labelledby="hero-headline">
      <HeroMedia />

      <div className={`${styles.content} page-grid`}>
        <div className={styles.text} data-hero-text>
          <p className={`eyebrow ${styles.marker}`} data-hero-fade>
            Energie- und Gebäudetechnik · Augsburg
          </p>

          {/*
            Line breaks are authored, not left to the browser: the three-line
            stack is the composition. The last line is allowed to run past the
            text column into the image channel — the one place on this page
            where the grid is deliberately broken.
          */}
          <h1 id="hero-headline" className={styles.headline}>
            <span className={styles.line} data-hero-line>
              <span>Energie,</span>
            </span>
            <span className={styles.line} data-hero-line>
              <span>die</span>
            </span>
            <span className={`${styles.line} ${styles.lineBreakout}`} data-hero-line>
              <span>weiterdenkt.</span>
            </span>
          </h1>

          <p className={styles.lede} data-hero-fade>
            Photovoltaik, Wärmepumpe und intelligente Energiesysteme für moderne Zuhause in
            Augsburg und Umgebung.
          </p>

          <div className={styles.actions} data-hero-fade>
            <Button href="/kontakt/" variant="primary">
              Projekt besprechen
            </Button>
            <Button href="/#loesungen" variant="secondary" arrow={false}>
              Lösungen entdecken
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollLabel}>Scrollen</span>
        <span className={styles.scrollTrack} />
      </div>
    </section>
  );
}
