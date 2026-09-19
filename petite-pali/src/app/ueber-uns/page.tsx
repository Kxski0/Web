import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Prose } from '@/components/page/Prose';
import type { Crumb } from '@/components/page/Breadcrumbs';
import { BRANDS, MATERIALS, ORIGIN, TEAM } from '@/content/facts';
import { SITE } from '@/content/site';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata = pageMetadata({
  title: 'Über uns',
  description:
    'Petite Pali ist eine inhabergeführte Baby- und Kinderboutique in der Kölner Südstadt. Wer dahintersteht und wie hier ausgesucht wird.',
  path: '/ueber-uns/',
  image: '/images/boutique-fenster.webp',
});

const TRAIL: Crumb[] = [
  { name: 'Startseite', path: '/' },
  { name: 'Über uns', path: '/ueber-uns/' },
];

/*
 * Modus: Read. Hier wird verstanden, nicht entschieden — Satzspiegel und Lesetakt gehen vor Ausdruck.
 */
export default function UeberUns() {
  return (
    <>
      <PageHero
        label="Über uns"
        lines={['Ein kleiner Laden', 'für ganz besondere', 'Anfänge.']}
        lede="Petite Pali liegt am Karolingerring, ein paar Schritte vom Chlodwigplatz. Klein genug, dass man in zehn Minuten alles gesehen hat — und dicht genug, dass man länger bleibt."
        trail={TRAIL}
        image={IMAGES.boutiqueFenster}
      />

      {/* Das Team steht so im bestehenden Auftritt. Porträts und ausführliche
          Geschichten fehlen noch — sie stehen in CONTENT-TODO.md und werden
          nicht erfunden. */}
      <section className={styles.team}>
        <div className="page-grid">
          <div className={styles.teamHead}>
            <p className={styles.label}>
              <span className={styles.rule} aria-hidden="true" />
              Wer dahintersteht
            </p>
            <h2 className={styles.teamTitle}>
              {TEAM.owner} — {TEAM.ownerRole}.
            </h2>
          </div>
          <div className={styles.teamBody}>
            <p>
              Im Rücken das Team: {TEAM.members.slice(0, -1).join(', ')} und{' '}
              {TEAM.members[TEAM.members.length - 1]}. Jede kennt das Sortiment von A bis Z und
              kann sagen, woher ein Teil kommt und warum es hier hängt.
            </p>
            <p>
              Das ist keine Floskel, sondern der Unterschied: Beratung wird hier ernst genommen,
              auch dann, wenn am Ende nichts gekauft wird.
            </p>
          </div>
        </div>
      </section>

      <MediaBand
        slot={IMAGES.boutiqueAuswahl}
        caption="Jedes Kleidungsstück, jedes Spielzeug, jedes Kuscheltier ist von Hand ausgesucht."
      />

      <Prose title="Unsere Auswahl">
        <ul>
          <li>
            <strong>Material.</strong> {MATERIALS.join(', ')} — Naturfasern, weil sie den ganzen
            Tag an der Haut liegen.
          </li>
          <li>
            <strong>Herkunft.</strong> {ORIGIN.share} der Ware kommt aus {ORIGIN.where}.
          </li>
          <li>
            <strong>Handverlesen.</strong> Jedes Teil wird einzeln entschieden. Was sich im Laden
            nicht begründen lässt, wird nicht bestellt.
          </li>
        </ul>
      </Prose>

      <Prose title="Unsere Haltung" tinted>
        <p>
          Ein Laden ist kein Lager mit Verkaufsfläche. Er ist der Ort, an dem man eine Frage
          stellen kann, ohne vorher zu wissen, wie sie heißt.
        </p>
        <p>
          Deshalb ist das Sortiment kleiner, als es sein könnte, und deshalb steht hier jemand,
          der zu jedem Teil etwas sagen kann.
        </p>
      </Prose>

      {BRANDS.length > 0 && (
        <section className={styles.brands}>
          <div className="page-bounds">
            <p className={styles.label}>
              <span className={styles.rule} aria-hidden="true" />
              Marken, die wir führen
            </p>
            <ul className={styles.brandList}>
              {BRANDS.map((b) => (
                <li key={b.name} className={styles.brand}>
                  {b.name}
                </li>
              ))}
            </ul>
            <p className={styles.brandNote}>
              Eine Auswahl, keine vollständige Liste — das Sortiment wechselt mit der Saison. Was
              gerade da ist, sehen Sie im Laden oder auf{' '}
              <a href={SITE.instagram.url} rel="noopener noreferrer" target="_blank">
                Instagram
              </a>
              .
            </p>
          </div>
        </section>
      )}

      <PageCta
        title="Kommen Sie vorbei."
        body="Karolingerring 5, am Chlodwigplatz. Wer etwas Bestimmtes sucht, ruft am besten kurz vorher an."
      />
    </>
  );
}
