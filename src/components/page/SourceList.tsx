import styles from './SourceList.module.css';

export type SourceEntry = {
  /** The statement itself. Kept short enough to be checkable against the source. */
  claim: string;
  /** Who says so. Named, not "Studien zeigen". */
  source: string;
  href: string;
};

/**
 * Facts with their origin attached.
 *
 * The regional pages exist because there is something locally true to say. §43
 * forbids inventing any of it, so every regional statement on those pages that
 * a reader could not verify by looking at their own building is repeated here
 * with the body that publishes it. Rules and plans change; a named source lets
 * a reader check whether ours is still current, which a bare claim never does.
 *
 * Deliberately not a card grid: a hairline-ruled register reads like a
 * reference list, which is what it is.
 */
export function SourceList({
  title = 'Woher diese Angaben stammen',
  intro,
  entries,
}: {
  title?: string;
  intro?: string;
  entries: SourceEntry[];
}) {
  if (entries.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="sources-title">
      <div className={`${styles.inner} page-grid`}>
        <div className={styles.head}>
          <p className="eyebrow">Belege</p>
          <h2 id="sources-title" className={styles.title}>
            {title}
          </h2>
          {intro && <p className={styles.intro}>{intro}</p>}
        </div>

        <ul className={styles.list}>
          {entries.map((entry) => (
            <li key={entry.href + entry.claim} className={styles.item}>
              <p className={styles.claim}>{entry.claim}</p>
              <p className={styles.source}>
                <a className={styles.link} href={entry.href} rel="noopener nofollow">
                  {entry.source}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
