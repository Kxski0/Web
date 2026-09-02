import styles from './Faq.module.css';

export type FaqEntry = { question: string; answer: string };

/**
 * FAQ plus FAQPage structured data (§36).
 *
 * Uses <details>, so every answer is readable with no JavaScript and the
 * open/closed state is handled by the platform rather than by a state hook that
 * would also have to reimplement keyboard behaviour.
 */
export function Faq({ entries, title = 'Häufige Fragen' }: { entries: FaqEntry[]; title?: string }) {
  if (entries.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };

  return (
    <section className={styles.section} aria-labelledby="faq-headline">
      <div className={`${styles.inner} page-grid`}>
        <h2 id="faq-headline" className={styles.headline}>
          {title}
        </h2>
        <div className={styles.list}>
          {entries.map((entry) => (
            <details key={entry.question} className={styles.item}>
              <summary className={styles.question}>
                <span>{entry.question}</span>
                <span className={styles.marker} aria-hidden="true" />
              </summary>
              <p className={styles.answer}>{entry.answer}</p>
            </details>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}
