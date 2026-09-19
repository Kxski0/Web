import styles from './Faq.module.css';

export type FaqEntry = { question: string; answer: string };

/**
 * Häufige Fragen. Die strukturierten Daten entstehen aus derselben Liste, die
 * gerendert wird — eine zweite Quelle würde früher oder später abweichen.
 *
 * Ohne Einträge rendert der Abschnitt nichts.
 */
export function Faq({ entries, title = 'Häufig gefragt' }: { entries: FaqEntry[]; title?: string }) {
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
    <section className={styles.section}>
      <div className="page-grid">
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.list}>
          {entries.map((entry) => (
            <details key={entry.question} className={styles.item}>
              <summary className={styles.summary}>
                <span>{entry.question}</span>
                <span className={styles.sign} aria-hidden="true" />
              </summary>
              <p className={styles.answer}>{entry.answer}</p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  );
}
