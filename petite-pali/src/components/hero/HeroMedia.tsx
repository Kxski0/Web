'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useHydrated } from '@/components/motion/useHydrated';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { IMAGES } from '@/lib/assets';
import styles from './HeroMedia.module.css';

/**
 * Hero-Bildfläche: Standbild zuerst, Video darüber.
 *
 * Das Poster wird immer serverseitig gerendert und ist damit das LCP-Element —
 * ein 63 KB großes WebP statt eines 1,2 MB großen Videos.
 *
 * Das Video wird erst nach der Hydration eingehängt und nur, wenn Bewegung
 * erwünscht ist: `prefers-reduced-motion` ist auf dem Server nicht bekannt, und
 * ein Video-Element im Serverausgabe lädt seine Datei, bevor React entscheiden
 * könnte, es zu entfernen. Wer Bewegung reduziert hat, soll die 1,2 MB nicht
 * bezahlen.
 */
export function HeroMedia() {
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const [ready, setReady] = useState(false);

  const poster = IMAGES.heroPoster;

  return (
    <div className={styles.frame}>
      <Image
        src={poster.src}
        alt={poster.alt}
        width={poster.width}
        height={poster.height}
        sizes="100vw"
        priority
        className={styles.layer}
      />

      {hydrated && !reduced && (
        <video
          className={`${styles.layer} ${styles.video}`}
          data-ready={ready}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster.src}
          // Das Video zeigt dasselbe wie das Poster, dessen Alternativtext oben
          // steht — zweimal vorgelesen wäre es nur Lärm.
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setReady(true)}
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      )}

      <div className={styles.veil} />
    </div>
  );
}
