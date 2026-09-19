import type { ReactNode } from 'react';
import { RevealText } from '@/components/motion/RevealText';
import styles from './Prose.module.css';

type Props = {
  title: string;
  children: ReactNode;
  align?: 'left' | 'right';
  tinted?: boolean;
};

/** Fließtextblock mit Überschrift. Der Wechsel der Ausrichtung gliedert die Seite. */
export function Prose({ title, children, align = 'left', tinted = false }: Props) {
  return (
    <section className={`${styles.block} ${tinted ? styles.blockTinted : ''}`}>
      <div className={`${align === 'right' ? styles.alignRight : styles.alignLeft} page-grid`}>
        <RevealText as="h2" className={styles.title}>
          {title}
        </RevealText>
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}
