import { Faq, type FaqEntry } from '@/components/page/Faq';
import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Prose } from '@/components/page/Prose';
import { Button } from '@/components/ui/Button';
import type { Crumb } from '@/components/page/Breadcrumbs';
import { CONTACT, formatPhone, telHref } from '@/content/site';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Frühchenmode',
  description:
    'Frühchenkleidung ab Größe 44 in Köln: kleine Größen, die sonst kaum jemand führt — im Laden am Chlodwigplatz zum Ansehen und Anfassen.',
  path: '/sortiment/fruehchen/',
  image: '/images/ware-spieluhren.webp',
});

const TRAIL: Crumb[] = [
  { name: 'Startseite', path: '/' },
  { name: 'Sortiment', path: '/sortiment/' },
  { name: 'Frühchen', path: '/sortiment/fruehchen/' },
];

const FAQ: FaqEntry[] = [
  {
    question: 'Ab welcher Größe führt ihr Frühchenkleidung?',
    answer:
      'Ab Größe 44 — also unterhalb der üblichen Neugeborenengröße. Welche Teile gerade in welcher Größe da sind, wechselt; ein Anruf klärt das am schnellsten.',
  },
  {
    question: 'Können wir vorbeikommen, ohne lange zu suchen?',
    answer:
      'Ja. Sagen Sie kurz vorher Bescheid, was Sie brauchen — dann liegt es bereit, wenn Sie kommen.',
  },
  {
    question: 'Geht das auch außerhalb der Öffnungszeiten?',
    answer:
      'Dafür gibt es den Shopping-Termin. Gerade in dieser Zeit ist ein ruhiger Laden oft mehr wert als eine große Auswahl.',
  },
];

/*
 * Modus: Persuade. Sensibler Anlass: die Handlung ist der Anruf, nicht der Kauf.
 */
export default function Fruehchen() {
  return (
    <>
      <PageHero
        label="Frühchen · ab Größe 44"
        lines={['Kleidung, die von', 'Anfang an passt.']}
        lede="Frühchenkleidung fängt dort an, wo die meisten Sortimente erst beginnen. Wer sie braucht, braucht sie sofort — und selten mit viel Zeit zum Suchen."
        trail={TRAIL}
        image={IMAGES.wareSpieluhren}
        actions={
          CONTACT.verified && CONTACT.phone ? (
            <>
              <Button href={telHref(CONTACT.phone)} arrow={false}>
                {formatPhone(CONTACT.phone)}
              </Button>
              <Button href="/shopping-termin/" variant="quiet">
                Shopping-Termin
              </Button>
            </>
          ) : undefined
        }
      />

      <Prose title="Warum das hier liegt">
        <p>
          Die Größen unter 50 sind im Handel selten. Viele Eltern erfahren erst in der Klinik, dass
          die Erstausstattung, die zu Hause liegt, noch nicht passt.
        </p>
        <p>
          Deshalb gehört Frühchenkleidung bei Petite Pali ins Regal und nicht in eine
          Bestellliste — zum Ansehen, Anfassen und Mitnehmen.
        </p>
      </Prose>

      <MediaBand
        slot={IMAGES.boutiqueRegalwand}
        caption="Die kleinen Größen liegen dort, wo man sie sucht: bei den anderen."
        width="narrow"
      />

      <Prose title="Wenn es schnell gehen muss" tinted>
        <p>
          Rufen Sie an, bevor Sie losfahren. Wir sehen nach, was in Ihrer Größe da ist, legen es
          zurück und Sie müssen im Laden nicht mehr suchen.
        </p>
        <p>
          Wenn ein Besuch gerade nicht möglich ist, finden wir auch dafür einen Weg — sprechen Sie
          uns einfach an.
        </p>
      </Prose>

      <Faq entries={FAQ} />

      <PageCta
        title="Fragen Sie einfach."
        body="Ein Anruf reicht, um zu klären, was da ist. Wir nehmen uns die Zeit — auch dann, wenn es schnell gehen muss."
      />
    </>
  );
}
