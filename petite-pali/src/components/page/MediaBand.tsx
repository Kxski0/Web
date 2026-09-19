import { RevealImage } from '@/components/motion/RevealImage';
import type { ImageSlot } from '@/lib/assets';
import styles from './MediaBand.module.css';

type Props = {
  slot: ImageSlot;
  caption?: string;
  width?: 'inset' | 'wide' | 'narrow';
};

export function MediaBand({ slot, caption, width = 'inset' }: Props) {
  return (
    <figure className={`${styles.band} ${styles[width] ?? ''}`} style={{ margin: 0 }}>
      <div className={styles.inner}>
        <RevealImage
          slot={slot}
          className={styles.frame}
          sizes={width === 'narrow' ? '(min-width: 52rem) 52rem, 92vw' : '100vw'}
        />
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
