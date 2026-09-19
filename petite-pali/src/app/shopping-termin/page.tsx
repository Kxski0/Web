import { ContactForm } from '@/components/page/ContactForm';
import { Faq, type FaqEntry } from '@/components/page/Faq';
import { PageHero } from '@/components/page/PageHero';
import type { Crumb } from '@/components/page/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { CONTACT, formatPhone, telHref } from '@/content/site';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata = pageMetadata({
  title: 'Shopping-Termin',
  description:
    'Ein Termin nur für euch: Erstausstattung, Trageberatung oder Kinderwagen in Ruhe — auf Wunsch außerhalb der Öffnungszeiten bei Petite Pali in Köln.',
  path: '/shopping-termin/',
  image: '/images/boutique-beratung.webp',
});

const TRAIL: Crumb[] = [
  { name: 'Startseite', path: '/' },
  { name: 'Shopping-Termin', path: '/shopping-termin/' },
];

const SCHRITTE = [
  {
    titel: 'Sie sagen, worum es geht',
    text: 'Erstausstattung, Trageberatung, Kinderwagen — und wann es Ihnen ungefähr passt.',
  },
  {
    titel: 'Wir schlagen einen Termin vor',
    text: 'Auf Wunsch auch außerhalb der regulären Öffnungszeiten.',
  },
  {
    titel: 'Sie kommen, wir nehmen uns Zeit',
    text: 'Ohne anderen Betrieb im Laden. So lange, wie es braucht.',
  },
];

const FAQ: FaqEntry[] = [
  {
    question: 'Kostet der Termin etwas?',
    answer:
      'Nein. Es ist ein Beratungstermin im Laden, kein gebuchter Dienst — Sie entscheiden danach in Ruhe, ob und was Sie kaufen.',
  },
  {
    question: 'Wie lange dauert das?',
    answer:
      'Das hängt vom Anlass ab. Für eine Trageberatung oder eine vollständige Erstausstattung sollten Sie mehr Zeit einplanen als für eine einzelne Frage.',
  },
  {
    question: 'Kann ich jemanden mitbringen?',
    answer:
      'Gern. Gerade bei der Erstausstattung ist eine zweite Meinung oft hilfreich — und das Kind sowieso, wenn es um eine Trage geht.',
  },
  {
    question: 'Was, wenn mir etwas dazwischenkommt?',
    answer:
      'Sagen Sie kurz Bescheid. Ein Termin, der nicht stattfindet, ist kein Problem — einer, von dem wir nichts wissen, schon.',
  },
];

export default function ShoppingTermin() {
  return (
    <>
      <PageHero
        label="Shopping-Termin"
        lines={['Nur ihr.', 'Ganz in Ruhe.']}
        lede="Manches lässt sich zwischen Tür und Angel nicht entscheiden. Dafür gibt es den Shopping-Termin — auf Wunsch außerhalb der regulären Öffnungszeiten."
        trail={TRAIL}
        image={IMAGES.boutiqueBeratung}
        actions={
          CONTACT.verified && CONTACT.phone ? (
            <Button href={telHref(CONTACT.phone)} variant="quiet" arrow={false}>
              Lieber anrufen: {formatPhone(CONTACT.phone)}
            </Button>
          ) : undefined
        }
      />

      <section className={styles.section}>
        <div className={`${styles.grid} page-grid`}>
          <div className={styles.how}>
            <h2 className={styles.heading}>So läuft es ab</h2>
            <ol className={styles.steps}>
              {SCHRITTE.map((s, i) => (
                <li key={s.titel} className={styles.step}>
                  <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className={styles.stepTitle}>{s.titel}</h3>
                    <p className={styles.stepText}>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className={styles.note}>
              Kein Buchungssystem, keine automatische Bestätigung: Sie schreiben uns, wir melden uns
              persönlich zurück. Das ist langsamer als ein Kalender — und für einen Laden dieser
              Größe ehrlicher.
            </p>
          </div>

          <div className={styles.form}>
            <h2 className={styles.formTitle}>Termin anfragen</h2>
            <p className={styles.formLede}>
              Ein paar Angaben genügen. Alles Weitere klären wir im Gespräch.
            </p>
            <ContactForm kind="termin" />
          </div>
        </div>
      </section>

      <Faq entries={FAQ} />
    </>
  );
}
