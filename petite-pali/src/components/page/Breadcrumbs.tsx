import Link from 'next/link';
import { breadcrumbSchema } from '@/lib/schema';
import styles from './Breadcrumbs.module.css';

export type Crumb = { name: string; path: string };

/**
 * Sichtbare Spur und maschinenlesbare Spur entstehen aus derselben Liste. So
 * können die beiden nicht auseinanderlaufen.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <>
      <nav aria-label="Brotkrumen">
        <ol className={styles.trail}>
          {trail.map((crumb, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={crumb.path} className={styles.item}>
                {last ? (
                  <span className={styles.current} aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.path} className={styles.link}>
                      {crumb.name}
                    </Link>
                    <span className={styles.sep} aria-hidden="true">
                      {' / '}
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
