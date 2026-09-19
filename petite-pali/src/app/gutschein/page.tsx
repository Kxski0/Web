import { ContactForm, Field } from '@/components/page/ContactForm';
import { Faq, type FaqEntry } from '@/components/page/Faq';
import { PageHero } from '@/components/page/PageHero';
import type { Crumb } from '@/components/page/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { CONTACT, formatPhone, telHref } from '@/content/site';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata = pageMetadata({
  title: 'Gutschein',
  description:
    'Gutschein für Petite Pali in Köln: Betrag frei wählbar, persönlich ausgestellt — für Baby- und Kindermode, Umstandsmode und Geschenke.',
  path: '/gutschein/',
  image: '/images/ware-regal.webp',
});

const TRAIL: Crumb[] = [
  { name: 'Startseite', path: '/' },
  { name: 'Gutschein', path: '/gutschein/' },
];

const FAQ: FaqEntry[] = [
  {
    question: 'Wie hoch kann der Betrag sein?',
    answer: 'Das entscheiden Sie. Sagen Sie uns einfach, welche Summe Sie im Sinn haben.',
  },
  {
    question: 'Wofür gilt der Gutschein?',
    answer:
      'Für das gesamte Sortiment im Laden — Kindermode, Umstandsmode, Spielzeug, Geschenke. Er ist nicht auf einen Bereich beschränkt.',
  },
  {
    question: 'Kann ich online bezahlen?',
    answer:
      'Nein. Der Gutschein wird persönlich ausgestellt; Betrag, Übergabe und Bezahlung besprechen wir direkt mit Ihnen. Eine automatische Zahlungsstrecke gibt es bewusst nicht.',
  },
  {
    question: 'Wie schnell geht das?',
    answer:
      'Wenn es eilig ist, rufen Sie an — im Laden lässt sich ein Gutschein sofort ausstellen. Über das Formular melden wir uns zurück.',
  },
];

export default function Gutschein() {
  return (
    <>
      <PageHero
        label="Gutschein"
        lines={['Etwas schenken,', 'ohne die Größe', 'zu kennen.']}
        lede="Der sicherste Weg, wenn Sie nicht wissen, was schon da ist: Betrag frei wählbar, einzulösen im gesamten Sortiment."
        trail={TRAIL}
        image={IMAGES.wareRegal}
        actions={
          CONTACT.verified && CONTACT.phone ? (
            <Button href={telHref(CONTACT.phone)} variant="quiet" arrow={false}>
              Sofort im Laden: {formatPhone(CONTACT.phone)}
            </Button>
          ) : undefined
        }
      />

      <section className={styles.section}>
        <div className={`${styles.grid} page-grid`}>
          <div className={styles.info}>
            <h2 className={styles.heading}>Wie es abläuft</h2>
            <p className={styles.text}>
              Sie sagen uns Betrag und für wen — wir melden uns zurück und klären Übergabe und
              Bezahlung persönlich mit Ihnen. Im Laden geht das sofort, über das Formular dauert es
              so lange, wie wir zum Antworten brauchen.
            </p>
            <p className={styles.text}>
              Bewusst ohne automatischen Versand und ohne Zahlungsstrecke: Einen Gutschein, den
              niemand in der Hand hatte, finden wir für diesen Laden nicht passend.
            </p>
          </div>

          <div className={styles.form}>
            <h2 className={styles.formTitle}>Gutschein anfragen</h2>
            <ContactForm
              kind="gutschein"
              extra={
                <div className={styles.extraGrid}>
                  <Field
                    name="betrag"
                    label="Gewünschter Betrag"
                    hint="Zum Beispiel: 50 Euro."
                    required
                  />
                  <Field
                    name="empfaenger"
                    label="Für wen? (optional)"
                    hint="Name, der auf dem Gutschein stehen soll."
                  />
                </div>
              }
            />
          </div>
        </div>
      </section>

      <Faq entries={FAQ} />
    </>
  );
}
