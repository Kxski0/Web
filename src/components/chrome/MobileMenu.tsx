'use client';

import { useEffect, useRef } from 'react';
import { NAV, PRIMARY_CTA } from '@/content/nav';
import { Wordmark } from './Wordmark';
import styles from './MobileMenu.module.css';

type Props = { open: boolean; onClose: () => void };

const FOCUSABLE = 'a[href], button:not([disabled])';

export function MobileMenu({ open, onClose }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;

    // Lock the page behind the overlay without losing the scroll position.
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const node = panel.current;
    node?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !node) return;

      // Trap: Tab out of either end wraps back inside the overlay.
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      restoreFocusTo.current?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={panel}
      className={styles.overlay}
      data-open={open}
      // Hidden from assistive tech and the tab order while closed.
      inert={!open ? true : undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
    >
      <div className={`${styles.bar} page-bounds`}>
        <Wordmark />
        <button type="button" onClick={onClose} className={styles.close}>
          Schließen
        </button>
      </div>

      <nav className={`${styles.nav} page-bounds`} aria-label="Hauptnavigation mobil">
        {NAV.map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            className={styles.item}
            onClick={onClose}
            style={{ '--i': index } as React.CSSProperties}
          >
            <span className={styles.itemIndex}>{String(index + 1).padStart(2, '0')}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className={`${styles.footer} page-bounds`}>
        <a href={PRIMARY_CTA.href} onClick={onClose} className={styles.footerCta}>
          {PRIMARY_CTA.label} <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
