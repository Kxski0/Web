import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GALLERY, IMAGES } from '@/lib/assets';
import styles from './GalleryTeaser.module.css';

export function GalleryTeaser() {
  const shots = GALLERY.slice(0, 8);

  return (
    <section className={styles.section} id="galerie">
      <div className="page-bounds">
        <div className={styles.head}>
          <SectionHeading label="Galerie" title="Ein Blick in den Laden." />
          <Button href="/galerie/" variant="quiet">
            Alle Aufnahmen
          </Button>
        </div>
      </div>

      <div className="page-bounds">
        <ul className={styles.strip}>
          {shots.map((name) => {
            const slot = IMAGES[name];
            return (
              <li key={name} className={styles.shot}>
                <Image
                  src={slot.src}
                  alt={slot.alt}
                  width={slot.width}
                  height={slot.height}
                  sizes="(min-width: 62rem) 22rem, 70vw"
                  style={{ objectPosition: slot.focus }}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
