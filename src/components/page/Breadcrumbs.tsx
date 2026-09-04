import { breadcrumbSchema } from '@/lib/schema';
import styles from './Breadcrumbs.module.css';

export type Crumb = { name: string; path: string };

/**
 * Breadcrumbs plus their structured data, emitted together so the visible trail
 * and the machine-readable one cannot drift apart (§36).
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <>
      <nav className={styles.nav} aria-label="Brotkrumennavigation">
        <ol className={styles.list}>
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1;
            return (
              <li key={crumb.path} className={styles.item}>
                {isLast ? (
                  <span aria-current="page">{crumb.name}</span>
                ) : (
                  <>
                    <a href={crumb.path} className={styles.link}>
                      {crumb.name}
                    </a>
                    <span className={styles.sep} aria-hidden="true">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(trail)) }}
      />
    </>
  );
}
