import type { ReactNode } from 'react';
import { RevealImage } from '@/components/motion/RevealImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { ImageSlot } from '@/lib/assets';
import styles from './EditorialSection.module.css';

type Props = {
  id?: string;
  label?: string;
  title: string;
  children: ReactNode;
  image: ImageSlot;
  caption?: string;
  /** Kehrt die Anordnung um — dadurch wechselt die Seite den Rhythmus. */
  reverse?: boolean;
  tinted?: boolean;
  actions?: ReactNode;
};

export function EditorialSection({
  id,
  label,
  title,
  children,
  image,
  caption,
  reverse = false,
  tinted = false,
  actions,
}: Props) {
  return (
    <section id={id} className={`${styles.section} ${tinted ? styles.tinted : ''}`}>
      <div className={`${styles.grid} ${reverse ? styles.reverse : ''} page-grid`}>
        <figure className={styles.media} style={{ margin: 0 }}>
          <RevealImage
            slot={image}
            className={styles.frame}
            sizes="(min-width: 62rem) 46vw, 92vw"
          />
          {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
        </figure>

        <div className={styles.text}>
          <SectionHeading label={label} title={title} />
          <div className={styles.body}>{children}</div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      </div>
    </section>
  );
}
