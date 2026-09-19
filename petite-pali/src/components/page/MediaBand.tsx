import { RevealImage } from '@/components/motion/RevealImage';
import type { ImageSlot } from '@/lib/assets';
import styles from './MediaBand.module.css';

type Props = {
  slot: ImageSlot;
  caption?: string;
  width?: 'inset' | 'wide' | 'narrow';
  /** Nur setzen, wenn der Zuschnitt aus scripts/media.mjs bewusst überschrieben wird. */
  ratio?: string;
};

export function MediaBand({ slot, caption, width = 'inset', ratio }: Props) {
  return (
    <figure className={`${styles.band} ${styles[width] ?? ''}`}>
      <div className={styles.inner}>
        <RevealImage
          slot={slot}
          ratio={ratio}
          sizes={width === 'narrow' ? '(min-width: 54rem) 54rem, 92vw' : '100vw'}
        />
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
