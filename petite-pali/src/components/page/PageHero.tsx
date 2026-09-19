import type { ReactNode } from 'react';
import { RevealText } from '@/components/motion/RevealText';
import { RevealImage } from '@/components/motion/RevealImage';
import type { ImageSlot } from '@/lib/assets';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';
import styles from './PageHero.module.css';

type Props = {
  label: string;
  /** Umbrüche werden gesetzt, nicht dem Zufall überlassen. */
  lines: string[];
  lede: string;
  trail: Crumb[];
  image?: ImageSlot;
  actions?: ReactNode;
};

export function PageHero({ label, lines, lede, trail, image, actions }: Props) {
  return (
    <section className={styles.hero}>
      <div className={`${styles.trail} page-bounds`}>
        <Breadcrumbs trail={trail} />
      </div>

      <div className={`${styles.grid} ${image ? '' : styles.wide} page-grid`}>
        <div className={styles.text}>
          <p className={styles.label}>
            <span className={styles.rule} aria-hidden="true" />
            {label}
          </p>

          <RevealText as="h1" className={styles.title} on="load">
            {lines.map((line, i) => (
              /*
               * Das Leerzeichen am Zeilenende ist nicht kosmetisch: die Zeilen
               * sind Blöcke, der zugängliche Name der Überschrift ist aber
               * reiner Text. Ohne es liest ein Screenreader „Was im Ladensteht".
               */
              <span key={line} style={{ display: 'block' }}>
                {i < lines.length - 1 ? `${line} ` : line}
              </span>
            ))}
          </RevealText>

          <p className={styles.lede}>{lede}</p>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>

        {image && (
          <div className={styles.media}>
            <RevealImage slot={image} sizes="(min-width: 62rem) 40vw, 92vw" priority />
          </div>
        )}
      </div>
    </section>
  );
}
