import { Button } from '@/components/ui/Button';
import { CONTACT, formatPhone, telHref } from '@/content/site';
import styles from './PageCta.module.css';

type Props = { title: string; body: string };

export function PageCta({ title, body }: Props) {
  return (
    <section className={styles.section}>
      <div className="page-bounds">
        <div className={styles.card}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.right}>
            <p className={styles.body}>{body}</p>
            <div className={styles.actions}>
              <Button href="/shopping-termin/">Shopping-Termin</Button>
              {CONTACT.verified && CONTACT.phone && (
                <Button href={telHref(CONTACT.phone)} variant="quiet" arrow={false}>
                  {formatPhone(CONTACT.phone)}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
