import Link from 'next/link';
import Image from 'next/image';
import { KATEGORIEN } from '@/content/kategorien';
import { SectionHeading } from '@/components/ui/SectionHeading';
import styles from './Kategorien.module.css';

export function Kategorien() {
  return (
    <section className={styles.section} id="sortiment">
      <div className="page-bounds">
        <SectionHeading
          label="Sortiment"
          title="Sechs Bereiche, ein Laden."
          lede="Von der Frühchengröße bis zur Grundschule, dazu alles, was in dieser Zeit sonst noch gebraucht wird."
        />

        <ul className={styles.grid}>
          {KATEGORIEN.map((k) => (
            <li key={k.id} className={styles.item}>
              <Link href={k.href} className={styles.link}>
                <div className={styles.media}>
                  <Image
                    src={k.image.src}
                    alt={k.image.alt}
                    width={k.image.width}
                    height={k.image.height}
                    sizes="(min-width: 48rem) 46vw, 92vw"
                    className={styles.image}
                    style={{ objectPosition: k.image.focus }}
                  />
                </div>

                <div className={styles.head}>
                  <h3 className={styles.name}>{k.label}</h3>
                  <span className={styles.note}>{k.note}</span>
                </div>

                <p className={styles.title}>{k.title}</p>
                <p className={styles.body}>{k.body}</p>

                <span className={styles.more}>
                  Mehr dazu
                  <svg className={styles.arrow} width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                    <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
