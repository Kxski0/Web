import Image from 'next/image';
import type { ImageSlot } from '@/lib/assets';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';
import styles from './PageHero.module.css';

type Props = {
  eyebrow: string;
  /** Authored as an array so each page controls its own line breaks. */
  headline: string[];
  lede: string;
  image: ImageSlot;
  trail: Crumb[];
  /** Alters the composition so the six pages do not open identically (§17). */
  variant?: 'split' | 'wide' | 'inset';
};

export function PageHero({ eyebrow, headline, lede, image, trail, variant = 'split' }: Props) {
  return (
    <section className={`${styles.hero} grain`} data-variant={variant} aria-labelledby="page-headline">
      <div className={`${styles.inner} page-grid`}>
        <div className={styles.text}>
          <Breadcrumbs trail={trail} />
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="page-headline" className={styles.headline}>
            {headline.map((line, index) => (
              <span key={line} className={styles.line}>
                {line}
                {index < headline.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className={styles.lede}>{lede}</p>
        </div>

        <div className={styles.media}>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 64rem) 55vw, 100vw"
            priority
            className={styles.image}
            style={{ objectPosition: image.focus }}
          />
        </div>
      </div>
    </section>
  );
}
