import { Faq } from '@/components/page/Faq';
import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { PriorityLadder } from '@/components/page/PriorityLadder';
import { Prose } from '@/components/page/Prose';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Energiemanagement — die Entscheidung, wohin der Strom geht',
  description:
    'Ohne Steuerung laufen Photovoltaik, Speicher und Wärmepumpe nebeneinander her. Das Energiemanagement priorisiert den eigenen Strom und macht aus Einzelkomponenten ein System.',
  path: '/energiemanagement/',
  image: '/images/energy-management.webp',
});

const TRAIL = [
  { name: 'Start', path: '/' },
  { name: 'Lösungen', path: '/#loesungen' },
  { name: 'Energiemanagement', path: '/energiemanagement/' },
];

const FAQ = [
  {
    question: 'Brauche ich das überhaupt, wenn ich nur Photovoltaik habe?',
    answer:
      'Bei einer reinen Photovoltaikanlage ohne steuerbare Verbraucher gibt es wenig zu entscheiden: Der Strom geht ins Haus oder ins Netz. Sobald ein Speicher, eine Wärmepumpe oder eine Wallbox dazukommt, entstehen Zielkonflikte — und damit der Bedarf, sie zu regeln.',
  },
  {
    question: 'Funktioniert das mit Geräten verschiedener Hersteller?',
    answer:
      'Oft, aber nicht immer und selten vollständig. Manche Hersteller öffnen ihre Geräte über offene Protokolle, andere nur über die eigene Cloud, wieder andere gar nicht. Deshalb prüfen wir die Kombinierbarkeit vor der Auswahl der Komponenten — nachträglich ist es meist eine Frage teurer Kompromisse.',
  },
  {
    question: 'Muss das System ins Internet?',
    answer:
      'Für die reine Steuerung im Haus nicht zwingend. Für Prognosen, Fernzugriff, App und Updates in der Regel schon. Wenn Ihnen daran liegt, dass die Anlage auch ohne Cloud weiterläuft, ist das ein Auswahlkriterium — und eines, das man vor dem Kauf prüfen muss.',
  },
  {
    question: 'Was passiert, wenn die Steuerung ausfällt?',
    answer:
      'Bei sinnvoll ausgelegten Anlagen fallen die Komponenten in ein sicheres Grundverhalten zurück: Die Photovoltaik speist ein, der Speicher lädt bei Überschuss, die Wärmepumpe heizt nach ihrer eigenen Regelung. Sie verlieren die Optimierung, nicht die Funktion. Genau so planen wir es.',
  },
  {
    question: 'Kann ich sehen, was das System tut?',
    answer:
      'Ja, und das halten wir für wesentlich. Eine Anlage, deren Verhalten man nachvollziehen kann, wird über die Jahre besser genutzt als eine Blackbox. Zur Übergabe gehört, dass Sie die Darstellung Ihrer Anlage verstehen und wissen, welche Stellschrauben es gibt.',
  },
];

export default function EnergiemanagementPage() {
  return (
    <>
      <PageHero
        eyebrow="Lösung 04 · Energiemanagement"
        headline={['Die Intelligenz', 'zwischen den', 'Komponenten.']}
        lede="Photovoltaik, Speicher und Wärmepumpe treffen jede für sich vernünftige Entscheidungen. Zusammen ergeben diese Entscheidungen nicht automatisch ein vernünftiges Ganzes."
        image={IMAGES.energyManagement}
        trail={TRAIL}
        variant="split"
      />

      <Prose eyebrow="Das Problem" title="Vier Geräte, vier Meinungen." align="left">
        <p>
          Der Speicher will laden, sobald Überschuss da ist. Die Wärmepumpe will heizen, sobald die
          Heizkurve es sagt. Die Wallbox will laden, sobald ein Auto angesteckt ist. Der
          Wechselrichter will einspeisen, was übrig bleibt.
        </p>
        <p>
          Jedes dieser Verhalten ist für sich richtig. Gemeinsam führen sie regelmäßig zu Ergebnissen,
          die niemand wollte: Der Speicher ist um elf Uhr voll, obwohl mittags noch fünf Stunden Sonne
          kommen. Das Auto lädt aus dem Speicher, obwohl in einer Stunde Überschuss da wäre. Die
          Wärmepumpe läuft nachts aus dem Netz, obwohl sie am Nachmittag hätte vorheizen können.
        </p>
        <p>
          Es fehlt keine weitere Komponente. Es fehlt eine Reihenfolge.
        </p>
      </Prose>

      <PriorityLadder />

      <Prose eyebrow="Die Steuerung" title="Was eine gute Regelung berücksichtigt." align="right">
        <ul>
          <li>
            <strong>Den aktuellen Überschuss</strong> am Netzverknüpfungspunkt, nicht die
            Erzeugung allein.
          </li>
          <li>
            <strong>Die Prognose</strong> für den weiteren Tag. Ob es sich lohnt, den Speicher jetzt
            zu füllen, hängt davon ab, was noch kommt.
          </li>
          <li>
            <strong>Den Zeitbedarf des Verbrauchers.</strong> Ein Auto, das erst morgen früh voll sein
            muss, ist flexibel. Eines, das in einer Stunde fahren muss, ist es nicht.
          </li>
          <li>
            <strong>Die Trägheit des Gebäudes.</strong> Ein gut gedämmtes Haus lässt sich am
            Nachmittag vorheizen und trägt die Wärme durch die Nacht. Das ist ein Speicher, den man
            nicht kaufen muss.
          </li>
          <li>
            <strong>Die Grenzen der Geräte.</strong> Mindestlaufzeiten, Taktsperren, minimale
            Ladeströme. Eine Regelung, die diese ignoriert, verschleißt Technik.
          </li>
        </ul>
      </Prose>

      <MediaBand
        image={IMAGES.energyManagement}
        width="full"
        caption="Technikwand mit Wechselrichtern, Unterverteilung und Speicher. Die Steuerung ist das kleinste Bauteil in diesem Bild und entscheidet über das Verhalten aller anderen."
      />

      <Prose eyebrow="Die Auswahl" title="Kombinierbarkeit ist ein Kaufkriterium." align="left">
        <p>
          Die unangenehme Wahrheit über Energiemanagement ist, dass es kaum an der Software
          scheitert, sondern an Schnittstellen. Ein Speicher, der sich nur über die Hersteller-Cloud
          ansprechen lässt, eine Wärmepumpe ohne nutzbaren Steuereingang, eine Wallbox mit
          proprietärem Protokoll — jede dieser Entscheidungen schränkt ein, was später möglich ist.
        </p>
        <p>
          Deshalb steht die Frage nach der Kombinierbarkeit bei uns vor der Komponentenauswahl und
          nicht danach. Es ist der Punkt, an dem sich entscheidet, ob aus vier Geräten ein System
          wird oder vier Geräte an einer Wand.
        </p>
      </Prose>

      <Faq entries={FAQ} />

      <PageCta
        headline="Sehen wir uns Ihre Komponenten an."
        body="Wenn schon Technik im Haus ist, prüfen wir, was davon miteinander sprechen kann und wo eine Steuerung tatsächlich etwas ändert. Wenn noch nichts steht, planen wir die Schnittstellen von Anfang an mit."
      />
    </>
  );
}
