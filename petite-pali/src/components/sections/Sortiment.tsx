import Image from 'next/image';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { RevealText } from '@/components/motion/RevealText';
import { Button } from '@/components/ui/Button';
import { KATEGORIEN } from '@/content/sortiment';
import styles from './Sortiment.module.css';

export function Sortiment() {
  return (
    <section className={styles.section} id="sortiment">
      <div className="page-bounds">
        <div className={styles.head}>
          <Eyebrow index="03">Sortiment</Eyebrow>
          <RevealText as="h2" className={styles.title}>
            Was im Laden steht.
          </RevealText>
        </div>

        <ul className={styles.cards}>
          {KATEGORIEN.map((k) => (
            <li key={k.id} className={`${styles.card} ${k.image ? '' : styles.cardPlain}`}>
              {/* Ohne Foto entfällt die Bildfläche; die Karte wechselt dafür
                  auf die Butterfassung — siehe .cardPlain. */}
              {k.image && (
                <div className={styles.media}>
                  <Image
                    src={k.image.src}
                    alt={k.image.alt}
                    width={k.image.width}
                    height={k.image.height}
                    sizes="(min-width: 62rem) 30vw, (min-width: 40rem) 45vw, 92vw"
                    className={styles.image}
                    style={{ objectPosition: k.image.focus }}
                  />
                </div>
              )}
              <div className={styles.cardBody}>
                <p className={styles.cardLabel}>{k.label}</p>
                <h3 className={styles.cardTitle}>{k.title}</h3>
                <p className={styles.cardText}>{k.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.more}>
          <Button href="/sortiment/" variant="secondary">
            Ausführlich zum Sortiment
          </Button>
        </div>
      </div>
    </section>
  );
}
