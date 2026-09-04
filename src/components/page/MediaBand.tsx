import Image from 'next/image';
import type { ImageSlot } from '@/lib/assets';
import styles from './MediaBand.module.css';

/**
 * A photograph used as a break in the reading rather than as decoration beside
 * it. `width` changes how far it reaches, so a page can vary its rhythm instead
 * of repeating one frame down the whole column.
 */
export function MediaBand({
  image,
  caption,
  width = 'full',
  ratio,
}: {
  image: ImageSlot;
  caption?: string;
  width?: 'full' | 'inset' | 'narrow';
  ratio?: string;
}) {
  return (
    <figure className={styles.figure} data-width={width}>
      <div className={styles.frame} style={ratio ? { aspectRatio: ratio } : undefined}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 64rem) 90vw, 100vw"
          className={styles.image}
          style={{ objectPosition: image.focus }}
        />
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
