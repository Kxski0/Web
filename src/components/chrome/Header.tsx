'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NAV, PRIMARY_CTA } from '@/content/nav';
import { MobileMenu } from './MobileMenu';
import { Wordmark } from './Wordmark';
import styles from './Header.module.css';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // rAF-throttled so the handler never runs more than once per frame.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 80);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    /*
     * The page alternates dark and light grounds. A fixed dark glass bar sitting
     * on the off-white section reads as a grey slab dropped onto the page, so
     * the header takes the surface it is currently over.
     *
     * An IntersectionObserver with a one-pixel-tall root region at the header's
     * vertical centre answers exactly the question being asked — which surface
     * is under the bar — without a scroll handler measuring rectangles.
     */
    const lightSections = document.querySelectorAll('[data-surface="light"]');
    if (lightSections.length === 0) return;

    const headerHeight = 78;
    const probe = Math.round(headerHeight / 2);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.setAttribute('data-under-header', String(entry.isIntersecting));
        }
        setOnLight(
          document.querySelector('[data-surface="light"][data-under-header="true"]') !== null,
        );
      },
      { rootMargin: `-${probe}px 0px -${window.innerHeight - probe - 1}px 0px`, threshold: 0 },
    );

    lightSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled} data-on-light={onLight}>
        <div className={`${styles.inner} page-bounds`}>
          <Link href="/" aria-label="SolBauTec — zur Startseite">
            <Wordmark />
          </Link>

          <nav className={styles.nav} aria-label="Hauptnavigation">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className={styles.link}>
                {item.label}
              </a>
            ))}
          </nav>

          <a href={PRIMARY_CTA.href} className={`${styles.cta} ${styles.link}`}>
            {PRIMARY_CTA.label} <span aria-hidden="true">→</span>
          </a>

          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            Menü
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
