import type { ReactNode } from 'react';
import styles from './Prose.module.css';

/**
 * A titled block of running text on a sub-page.
 *
 * `align` decides which side of the grid the block sits on. Consecutive blocks
 * alternate, so a long page reads as a rhythm rather than as one column of text
 * with headings dropped into it (§38: distribute the text, no wall of copy).
 */
export function Prose({
  eyebrow,
  title,
  children,
  align = 'left',
  surface = 'dark',
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  align?: 'left' | 'right';
  surface?: 'dark' | 'light';
}) {
  return (
    <section className={styles.section} data-align={align} data-surface-tone={surface}>
      <div className={`${styles.inner} page-grid`}>
        <div className={styles.head}>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}
