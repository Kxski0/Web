import Image from 'next/image';
import Link from 'next/link';
import { IMAGES } from '@/lib/assets';
import styles from './StoreExperience.module.css';

export function StoreExperience() {
  const slot = IMAGES.boutiqueFenster;

  return (
    <section className={styles.section} id="besuch">
      {/*
        * data-surface="media" ist nicht dekorativ: scripts/audit.mjs nimmt das
        * als Grenze und misst den Kontrast der Schrift darüber an den echten
        * Pixeln statt gegen die Seitenfarbe. Ohne die Kennzeichnung würde die
        * Prüfung das Falsche vergleichen.
        */}
      <div className={styles.media} data-surface="media">
        <Image
          src={slot.src}
          alt={slot.alt}
          width={slot.width}
          height={slot.height}
          sizes="100vw"
          style={{ objectPosition: slot.focus }}
        />
        {/* Schleier: der Text darüber braucht eine verlässliche Fläche.
            scripts/audit.mjs misst den Kontrast an den echten Pixeln. */}
        <div className={styles.veil} />

        <div className={styles.content}>
          <div className="page-bounds">
            <h2 className={styles.title}>Komm vorbei. Nimm dir Zeit.</h2>
            <p className={styles.body}>
              Anfassen, anprobieren, Fragen stellen, in Ruhe entscheiden. Das ist der Unterschied
              zwischen einem Laden und einem Warenkorb — und der Grund, warum es Petite Pali als
              Laden gibt.
            </p>
            <div className={styles.actions}>
              <Link href="/kontakt/" className={`pressable ${styles.primary}`}>
                Boutique besuchen
              </Link>
              <Link href="/shopping-termin/" className={`pressable ${styles.secondary}`}>
                Shopping-Termin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
