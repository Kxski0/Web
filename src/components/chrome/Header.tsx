'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NAV, PRIMARY_CTA } from '@/content/nav';
import { MobileMenu } from './MobileMenu';
import { Wordmark } from './Wordmark';
import styles from './Header.module.css';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
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

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled}>
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
