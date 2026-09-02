import { Faq } from '@/components/page/Faq';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Prose } from '@/components/page/Prose';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Klimasysteme — Kühlung, die zur Heiztechnik passt',
  description:
    'Kühlung und Lüftung greifen auf dieselbe Gebäudetechnik zu wie die Wärmeerzeugung. SolBauTec plant Klimasysteme gemeinsam mit Wärmepumpe und Energiemanagement.',
  path: '/klima/',
});

const TRAIL = [
  { name: 'Start', path: '/' },
  { name: 'Lösungen', path: '/#loesungen' },
  { name: 'Klima', path: '/klima/' },
];

const FAQ = [
  {
    question: 'Reicht Kühlung über die Fußbodenheizung?',
    answer:
      'Für die Grundlast in einem gut verschatteten, massiven Gebäude oft ja. Sie ist leise, zugfrei und braucht kein zusätzliches Gerät im Raum. Ihre Grenzen sind die Trägheit und die Taupunktgrenze: Zu weit herunterkühlen führt zu Kondensat am Boden, deshalb ist die erreichbare Absenkung begrenzt. Für Räume unter dem Dach oder mit großen Südfenstern reicht sie meist nicht.',
  },
  {
    question: 'Was bringt Verschattung im Vergleich?',
    answer:
      'Meist mehr als jede Kühltechnik, und zwar deutlich. Wärme, die gar nicht erst ins Gebäude kommt, muss nicht wieder heraustransportiert werden. Außenliegender Sonnenschutz ist deshalb fast immer die erste Maßnahme, bevor über Kühlleistung gesprochen wird.',
  },
  {
    question: 'Kann die Klimaanlage mit meiner Photovoltaik laufen?',
    answer:
      'Hier passt es zeitlich ausgesprochen gut: Der Kühlbedarf ist genau dann am höchsten, wenn die Sonne am stärksten scheint. Von allen Verbrauchern im Haus ist Kühlung der, dessen Bedarf am besten mit dem Solarertrag zusammenfällt.',
  },
];

export default function KlimaPage() {
  return (
    <>
      <PageHero
        eyebrow="Lösung 05 · Klima"
        headline={['Kühlen ist die', 'andere Hälfte', 'der Heiztechnik.']}
        lede="Kühlung, Lüftung und Wärmeerzeugung greifen auf dieselben Flächen, dieselbe Hydraulik und denselben Strom zu. Getrennt geplant arbeiten sie gegeneinander."
        image={IMAGES.finishedHouseEvening}
        trail={TRAIL}
        variant="wide"
      />

      <Prose eyebrow="Der Zusammenhang" title="Dieselben Flächen, andere Richtung." align="left">
        <p>
          Eine Fußbodenheizung ist im Sommer eine Kühlfläche. Eine Wärmepumpe, die Wärme aus der Luft
          holt, kann den Kreis umkehren. Eine Lüftungsanlage mit Wärmerückgewinnung kann im Sommer
          nachts kühle Luft ins Gebäude bringen.
        </p>
        <p>
          Das heißt: Der größte Teil der Kühlung liegt bereits in der Technik, die für das Heizen
          eingebaut wird — vorausgesetzt, sie wurde von Anfang an dafür ausgelegt. Nachträglich
          scheitert es oft an Kleinigkeiten: fehlende Taupunktüberwachung, ein Verteiler ohne
          Umschaltmöglichkeit, ein Gerät ohne Kühlfunktion.
        </p>
      </Prose>

      <Prose eyebrow="Die Reihenfolge" title="Erst nicht hereinlassen, dann heraustransportieren." align="right">
        <ul>
          <li>
            <strong>Sonnenschutz außen.</strong> Was draußen abgefangen wird, muss nicht gekühlt
            werden. Die wirksamste und günstigste Maßnahme, fast immer.
          </li>
          <li>
            <strong>Nachtlüftung.</strong> Massive Bauteile nachts entladen, damit sie tagsüber
            wieder aufnehmen können.
          </li>
          <li>
            <strong>Flächenkühlung.</strong> Über die vorhandene Fußbodenheizung, leise und zugfrei,
            begrenzt durch die Taupunktgrenze.
          </li>
          <li>
            <strong>Aktive Kühlung, gezielt.</strong> Für einzelne Räume mit hoher Last —
            Dachgeschoss, Südseite, Serverraum — statt für das ganze Gebäude.
          </li>
        </ul>
        <p>
          Diese Reihenfolge spart Technik. Wer sie umdreht, kauft Kühlleistung, um ein Problem zu
          lösen, das eine Markise günstiger gelöst hätte.
        </p>
      </Prose>

      <Prose eyebrow="Die Integration" title="Der Verbraucher, der am besten zur Sonne passt." align="left" surface="light">
        <p>
          Kühlung ist unter allen Verbrauchern im Haus derjenige mit der besten zeitlichen
          Übereinstimmung zum Solarertrag. Der Bedarf steigt mit der Einstrahlung — genau dann, wenn
          die Photovoltaikanlage am meisten liefert.
        </p>
        <p>
          Damit ist Kühlung, anders als das Heizen im Januar, ein Fall, in dem eigener Strom den
          Verbrauch tatsächlich weitgehend decken kann. Vorausgesetzt, das Energiemanagement kennt
          die Kühlung als steuerbaren Verbraucher.
        </p>
      </Prose>

      <Faq entries={FAQ} />

      <PageCta
        headline="Planen wir Heizen und Kühlen zusammen."
        body="Wenn ohnehin eine Wärmepumpe ansteht, ist das der richtige Zeitpunkt, die Kühlung mitzudenken. Später nachzurüsten ist fast immer teurer als die Auslegung von Anfang an."
      />
    </>
  );
}
