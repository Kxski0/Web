import { Eyebrow } from '@/components/ui/Eyebrow';
import { BRANDS } from '@/content/brands';
import styles from './Marken.module.css';

/**
 * Markenwand. Rendert nichts, solange keine Marke belegt ist — eine leere
 * Überschrift „Unsere Marken“ wäre schlechter als gar kein Abschnitt.
 */
export function Marken() {
  if (BRANDS.length === 0) return null;

  return (
    <section className={styles.section} id="marken">
      <div className="page-bounds">
        <div className={styles.head}>
          <Eyebrow index="07">Marken</Eyebrow>
          <h2 className={styles.title}>Unter anderem geführt:</h2>
        </div>

        <ul className={styles.list}>
          {BRANDS.map((brand) => (
            <li key={brand.name} className={styles.item}>
              {brand.name}
            </li>
          ))}
        </ul>

        <p className={styles.note}>
          Eine Auswahl. Das Sortiment wechselt mit der Saison — was gerade da ist, sehen Sie am
          besten im Laden.
        </p>
      </div>
    </section>
  );
}
