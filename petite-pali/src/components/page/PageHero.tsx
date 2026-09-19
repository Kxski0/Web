import { RevealText } from '@/components/motion/RevealText';
import { RevealImage } from '@/components/motion/RevealImage';
import { Eyebrow } from '@/components/ui/Eyebrow';
import type { ImageSlot } from '@/lib/assets';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';
import styles from './PageHero.module.css';

type Props = {
  eyebrow: string;
  /** Umbrüche werden gesetzt, nicht dem Zufall überlassen. */
  lines: string[];
  lede: string;
  trail: Crumb[];
  image?: ImageSlot;
};

export function PageHero({ eyebrow, lines, lede, trail, image }: Props) {
  return (
    <section className={styles.hero}>
      <div className={`${styles.trail} page-bounds`}>
        <Breadcrumbs trail={trail} />
      </div>
      <div className={`${styles.grid} page-grid`}>
        <div className={styles.text}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <RevealText as="h1" className={styles.title} on="load">
            {lines.map((line, i) => (
              /*
               * Das Leerzeichen am Zeilenende ist nicht kosmetisch: die Zeilen
               * sind Blöcke, der zugängliche Name der Überschrift ist aber
               * reiner Text. Ohne es liest ein Screenreader „Was im
               * Ladensteht“. Sichtbar fällt es weg, weil Blöcke umbrechen.
               */
              <span key={line} style={{ display: 'block' }}>
                {i < lines.length - 1 ? `${line} ` : line}
              </span>
            ))}
          </RevealText>
          <p className={styles.lede}>{lede}</p>
        </div>

        {image && (
          <div className={styles.media}>
            <RevealImage
              slot={image}
              className={styles.frame}
              sizes="(min-width: 62rem) 40vw, 92vw"
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
}
