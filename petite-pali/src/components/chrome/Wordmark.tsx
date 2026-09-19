import Image from 'next/image';
import { BRAND } from '@/lib/assets';
import { SITE } from '@/content/site';
import styles from './Wordmark.module.css';

type Props = {
  /**
   * 'compact' setzt das Hasenmotiv neben den gesetzten Namen — so bleibt der
   * Name auch bei Kopfzeilengröße lesbar. 'full' zeigt den gezeichneten
   * Schriftzug samt Zusatzzeile und braucht entsprechend Platz.
   */
  variant?: 'compact' | 'full';
  width?: number;
};

export function Wordmark({ variant = 'compact', width = 260 }: Props) {
  if (variant === 'full') {
    return (
      <Image
        src={BRAND.schriftzug.src}
        width={BRAND.schriftzug.width}
        height={BRAND.schriftzug.height}
        alt={`${SITE.name} — ${SITE.descriptor}`}
        className={styles.full}
        style={{ width, height: 'auto' }}
        priority
      />
    );
  }

  return (
    <span className={styles.compact}>
      <Image
        src={BRAND.marke.src}
        width={BRAND.marke.width}
        height={BRAND.marke.height}
        alt=""
        aria-hidden="true"
        className={styles.mark}
      />
      <span className={styles.name}>{SITE.name}</span>
    </span>
  );
}
