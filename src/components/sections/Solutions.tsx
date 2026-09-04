import { Eyebrow } from '@/components/ui/Eyebrow';
import { RevealImage } from '@/components/motion/RevealImage';
import { FURTHER_SOLUTIONS, SOLUTIONS } from '@/content/solutions';
import styles from './Solutions.module.css';

/**
 * Section 04 — the offering.
 *
 * Explicitly not a card grid. Each solution is a full editorial block that
 * alternates side, and the image aspect changes with the subject rather than
 * being forced into one uniform frame: a roof reads wide, a heat pump against a
 * façade reads tall. Uniform tiles would make four different kinds of work look
 * like four interchangeable products, which is the opposite of the argument the
 * page is making.
 *
 * The two offerings without photography of their own are listed as text. A
 * stand-in picture of something else would misrepresent the work.
 */
export function Solutions() {
  return (
    <section
      id="loesungen"
      className={styles.section}
      data-surface="light"
      aria-labelledby="solutions-headline"
    >
      <div className={`${styles.intro} page-grid`}>
        <div className={styles.introText}>
          <Eyebrow index="04">Lösungen</Eyebrow>
          <h2 id="solutions-headline" className={styles.headline}>
            Vier Komponenten,
            <br />
            die zusammen mehr leisten.
          </h2>
        </div>
      </div>

      <div className={styles.list}>
        {SOLUTIONS.map((solution, index) => (
          <article
            key={solution.id}
            id={solution.id}
            className={`${styles.item} page-grid`}
            data-side={index % 2 === 0 ? 'left' : 'right'}
            data-portrait={solution.image.height > solution.image.width}
          >
            <div className={styles.media}>
              <RevealImage
                slot={solution.image}
                className={styles.mediaFrame}
                sizes="(min-width: 64rem) 50vw, 100vw"
              />
            </div>

            <div className={styles.body}>
              <p className={styles.index}>{solution.index}</p>
              <p className="eyebrow">{solution.label}</p>
              <h3 className={styles.title}>{solution.title}</h3>
              <p className={styles.copy}>{solution.body}</p>
              <a href={solution.href} className={styles.link}>
                Mehr zu {solution.label}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className={`${styles.further} page-grid`}>
        <h3 className={styles.furtherTitle}>Weitere Gebäudelösungen</h3>
        <ul className={styles.furtherList}>
          {FURTHER_SOLUTIONS.map((item) => (
            <li key={item.id} className={styles.furtherItem}>
              <a href={item.href} className={styles.furtherLink}>
                {item.label}
                <span aria-hidden="true">→</span>
              </a>
              <p className={styles.copy}>{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
