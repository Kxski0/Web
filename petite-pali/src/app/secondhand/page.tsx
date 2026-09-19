import { Faq, type FaqEntry } from '@/components/page/Faq';
import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Prose } from '@/components/page/Prose';
import type { Crumb } from '@/components/page/Breadcrumbs';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Neu & Secondhand',
  description:
    'Neue und gut erhaltene gebrauchte Kinderkleidung nebeneinander im selben Regal — wie Secondhand bei Petite Pali in Köln funktioniert.',
  path: '/secondhand/',
  image: '/images/outfit-herbst.webp',
});

const TRAIL: Crumb[] = [
  { name: 'Startseite', path: '/' },
  { name: 'Neu & Secondhand', path: '/secondhand/' },
];

const FAQ: FaqEntry[] = [
  {
    question: 'Nehmt ihr gerade Ware an?',
    answer:
      'Das hängt davon ab, was in der jeweiligen Größe und Jahreszeit schon da ist. Rufen Sie kurz an, bevor Sie eine Tasche durch die halbe Stadt tragen.',
  },
  {
    question: 'In welchem Zustand muss die Kleidung sein?',
    answer:
      'Gewaschen, vollständig, ohne Löcher, ohne ausgewaschene Farben, ohne fehlende Knöpfe. Der Maßstab ist derselbe wie bei neuer Ware — sonst hätte das Nebeneinander im Regal keinen Sinn.',
  },
  {
    question: 'Sieht man einem Teil an, ob es neu oder secondhand ist?',
    answer:
      'Am Etikett ja, im Regal nicht unbedingt — genau das ist die Idee. Gefragt wird trotzdem beantwortet, zu jedem einzelnen Teil.',
  },
];

export default function Secondhand() {
  return (
    <>
      <PageHero
        eyebrow="Neu & Secondhand"
        lines={['Zwei Wege,', 'ein Regal.']}
        lede="Neue Ware und gut erhaltene gebrauchte Kleidung stehen hier nebeneinander, nicht in getrennten Abteilungen. Geprüft wird beides nach denselben Maßstäben."
        trail={TRAIL}
        image={IMAGES.outfitHerbst}
      />

      <Prose title="Warum das zusammenpasst">
        <p>
          Kinder wachsen schneller aus Kleidung heraus, als sie sie kaputt bekommen. Eine Jacke aus
          Größe 98 hat oft einen Winter hinter sich und drei vor sich. Sie in den Keller zu legen,
          ist die Verschwendung — nicht sie weiterzugeben.
        </p>
        <p>
          Deshalb hängt Gebrauchtes hier nicht in einer Ecke mit eigener Beschilderung, sondern
          dort, wo es hingehört: bei der Größe, die gesucht wird.
        </p>
      </Prose>

      <Prose title="Was geprüft wird" align="right" tinted>
        <ul>
          <li>Vollständigkeit — alle Knöpfe, Reißverschlüsse, Träger.</li>
          <li>Stoff — keine Löcher, keine dünnen Stellen, keine Knötchen an den Belastungsstellen.</li>
          <li>Farbe — nichts Ausgewaschenes, nichts Verfärbtes.</li>
          <li>Passform — nichts Ausgeleiertes, das nach dem ersten Waschen hängt.</li>
        </ul>
        <p>
          Was das nicht besteht, kommt nicht ins Regal. Auch dann nicht, wenn es von einer teuren
          Marke ist.
        </p>
      </Prose>

      <MediaBand
        slot={IMAGES.eingang}
        caption="Vor dem Laden am Karolingerring — Ware wechselt mit der Jahreszeit."
        width="narrow"
      />

      <Prose title="Wenn Sie etwas abgeben möchten">
        <p>
          Am einfachsten: vorher kurz anrufen und sagen, welche Größen Sie haben. Dann klären wir in
          zwei Minuten, ob es gerade passt — und Sie ersparen sich den Weg mit einer vollen Tasche.
        </p>
        <p>
          Zu welchen Bedingungen angenommen wird, besprechen wir im Laden. Das hängt vom Zustand und
          vom Bestand ab und lässt sich nicht seriös vorab auf eine Seite schreiben.
        </p>
      </Prose>

      <Faq entries={FAQ} />

      <PageCta
        title="Erst anrufen, dann packen."
        body="Ein kurzer Anruf klärt, ob wir gerade Ihre Größen brauchen — das ist für alle Beteiligten der kürzeste Weg."
      />
    </>
  );
}
