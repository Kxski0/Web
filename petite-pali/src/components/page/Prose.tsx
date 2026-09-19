import type { ReactNode } from 'react';
import { RevealText } from '@/components/motion/RevealText';
import styles from './Prose.module.css';

type Props = { title: string; children: ReactNode; tinted?: boolean };

/** Fließtextblock mit Überschrift in der linken Spalte — ruhiger Lesetakt. */
export function Prose({ title, children, tinted = false }: Props) {
  return (
    <section className={`${styles.block} ${tinted ? styles.tinted : ''}`}>
      <div className="page-grid">
        <RevealText as="h2" className={styles.title}>
          {title}
        </RevealText>
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}
