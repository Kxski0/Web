import { Breadcrumbs } from '@/components/page/Breadcrumbs';
import { ContactForm } from '@/components/page/ContactForm';
import { CONTACT } from '@/content/site';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata = pageMetadata({
  title: 'Kontakt — erzählen Sie uns von Ihrem Projekt',
  description:
    'Photovoltaik, Wärmepumpe, Stromspeicher oder eine Kombination: Schildern Sie uns Ihr Vorhaben. Wir sehen uns Gebäude, Verbrauch und Bestand an und sagen Ihnen, was sinnvoll ist.',
  path: '/kontakt/',
});

const TRAIL = [
  { name: 'Start', path: '/' },
  { name: 'Kontakt', path: '/kontakt/' },
];

export default function KontaktPage() {
  return (
    <section className={`${styles.page} grain`} aria-labelledby="kontakt-headline">
      <div className={`${styles.inner} page-grid`}>
        <div className={styles.intro}>
          <Breadcrumbs trail={TRAIL} />
          <p className="eyebrow">Kontakt</p>
          <h1 id="kontakt-headline" className={styles.headline}>
            Erzählen Sie uns
            <br />
            von Ihrem Projekt.
          </h1>
          <p className={styles.lede}>
            Je konkreter Ihre Angaben, desto konkreter unsere Antwort. Ein Foto vom Dach und die
            letzte Stromabrechnung reichen oft für eine erste belastbare Einschätzung.
          </p>

          <dl className={styles.facts}>
            <div>
              <dt>Was danach passiert</dt>
              <dd>
                Wir melden uns mit Rückfragen und schlagen einen Termin vor Ort vor. Ohne Termin
                lässt sich ein Gebäude nicht seriös beurteilen.
              </dd>
            </div>
            <div>
              <dt>Was es kostet</dt>
              <dd>Das Erstgespräch nichts. Wir sagen Ihnen vorher, wenn sich das ändert.</dd>
            </div>
          </dl>

          {/*
            Direct contact details appear only once they are confirmed. Publishing
            an unverified phone number on the page people use to reach a company
            is the worst possible place to guess. See CONTENT-TODO.md.
          */}
          {CONTACT.verified && (CONTACT.phone || CONTACT.email) && (
            <p className={styles.direct}>
              Lieber direkt:{' '}
              {CONTACT.phone && (
                <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a>
              )}
              {CONTACT.phone && CONTACT.email && ' · '}
              {CONTACT.email && <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>}
            </p>
          )}
        </div>

        <div className={styles.formArea}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
