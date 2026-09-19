import { Eyebrow } from '@/components/ui/Eyebrow';
import { RevealText } from '@/components/motion/RevealText';
import { RevealImage } from '@/components/motion/RevealImage';
import { IMAGES } from '@/lib/assets';
import styles from './ImLaden.module.css';

const BILDER = [
  { slot: IMAGES.ladenTisch, caption: 'Der Tisch in der Mitte, sortiert nach Größe.' },
  { slot: IMAGES.ladenRegal, caption: 'Kuscheltiere und Rucksäcke am Eingang.' },
  { slot: IMAGES.spieluhren, caption: 'Spieluhren, die tatsächlich benutzt werden.' },
  { slot: IMAGES.schaufenster, caption: 'Das Schaufenster wechselt mit der Jahreszeit.' },
];

export function ImLaden() {
  return (
    <section className={styles.section} id="im-laden">
      <div className="page-bounds">
        <div className={styles.head}>
          <Eyebrow index="06">Im Laden</Eyebrow>
          <RevealText as="h2" className={styles.title}>
            So sieht es aus.
          </RevealText>
        </div>

        <div className={styles.band}>
          {BILDER.map((bild) => (
            <figure key={bild.slot.src} className={styles.figure}>
              <RevealImage
                slot={bild.slot}
                className={styles.frame}
                sizes="(min-width: 62rem) 24vw, (min-width: 40rem) 46vw, 92vw"
              />
              <figcaption className={styles.caption}>{bild.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
