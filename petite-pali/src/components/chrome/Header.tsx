'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV, PRIMARY_CTA } from '@/content/nav';
import { SITE } from '@/content/site';
import { MobileMenu } from './MobileMenu';
import { Wordmark } from './Wordmark';
import styles from './Header.module.css';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Auf einen Frame gedrosselt: der Handler läuft nie öfter als einmal je Bild.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
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

  const isCurrent = (href: string) => pathname === href;

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled}>
        <div className={`${styles.inner} page-bounds`}>
          <Link href="/" aria-label={`${SITE.name} — zur Startseite`}>
            <Wordmark />
          </Link>

          <nav className={styles.nav} aria-label="Hauptnavigation">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.link}
                aria-current={isCurrent(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href={PRIMARY_CTA.href} className={`${styles.cta} ${styles.link}`}>
            {PRIMARY_CTA.label} <span aria-hidden="true">→</span>
          </Link>

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
