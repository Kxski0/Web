import Link from 'next/link';
import { CONTACT, formatPhone, telHref } from '@/content/site';
import styles from './PageCta.module.css';

type Props = { title: string; body: string };

export function PageCta({ title, body }: Props) {
  return (
    <section className={styles.section}>
      <div className="page-bounds">
        <div className={styles.card}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.body}>{body}</p>
          <div className={styles.actions}>
            <Link href="/kontakt/" className={styles.primary}>
              Besuch &amp; Kontakt <span aria-hidden="true">→</span>
            </Link>
            {CONTACT.verified && CONTACT.phone && (
              <a href={telHref(CONTACT.phone)} className={styles.secondary}>
                {formatPhone(CONTACT.phone)}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
