import { Faq } from '@/components/page/Faq';
import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Prose } from '@/components/page/Prose';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Photovoltaik — Planung und Installation in Augsburg',
  description:
    'Photovoltaik vom Dachcheck bis zur Inbetriebnahme: Belegung, Verschattungsanalyse, Wechselrichter und Anbindung an Speicher und Wärmepumpe. SolBauTec plant Anlagen als Teil eines Energiesystems.',
  path: '/photovoltaik/',
  image: '/images/roof-architecture.webp',
});

const TRAIL = [
  { name: 'Start', path: '/' },
  { name: 'Lösungen', path: '/#loesungen' },
  { name: 'Photovoltaik', path: '/photovoltaik/' },
];

const FAQ = [
  {
    question: 'Lohnt sich Photovoltaik auch auf einem Ost-West-Dach?',
    answer:
      'In der Regel ja. Ein Ost-West-Dach liefert über den Tag weniger Spitzenleistung als ein Süddach, dafür einen flacheren Ertragsverlauf mit Erträgen am Morgen und am Abend. Das passt oft besser zum Verbrauch eines Haushalts und erhöht den Eigenverbrauchsanteil. Entscheidend ist die Rechnung für Ihr Dach, nicht die Himmelsrichtung allein.',
  },
  {
    question: 'Muss das Dach vorher saniert werden?',
    answer:
      'Das hängt vom Zustand der Eindeckung ab. Eine Photovoltaikanlage bleibt Jahrzehnte auf dem Dach; steht in dieser Zeit ohnehin eine Sanierung an, ist es günstiger, sie vorher zu machen als die Anlage später ab- und wieder aufzubauen. Wir sagen Ihnen beim Dachcheck, was wir sehen.',
  },
  {
    question: 'Wie stark stört Verschattung?',
    answer:
      'Deutlich stärker, als viele erwarten, weil in einem String der schwächste Punkt den Strang bestimmt. Kamin, Gaube, Antenne oder ein Nachbarbaum können den Ertrag spürbar drücken. Deshalb gehört eine Verschattungsanalyse vor die Auslegung — und je nach Ergebnis Leistungsoptimierer oder eine andere Verschaltung.',
  },
  {
    question: 'Wer meldet die Anlage an?',
    answer:
      'Das übernehmen wir. Dazu gehören die Anmeldung beim Netzbetreiber, die Inbetriebsetzung und die Registrierung im Marktstammdatenregister.',
  },
  {
    question: 'Kann ich später erweitern?',
    answer:
      'Ja, wenn die Anlage von Anfang an dafür ausgelegt ist. Reserve im Wechselrichter, ausreichend dimensionierte Leitungswege und Platz im Zählerschrank kosten bei der Erstinstallation wenig und sparen später viel. Wir planen diese Reserve mit ein, wenn ein Speicher, eine Wärmepumpe oder eine Wallbox absehbar sind.',
  },
];

export default function PhotovoltaikPage() {
  return (
    <>
      <PageHero
        eyebrow="Lösung 01 · Photovoltaik"
        headline={['Das Dach wird', 'zur Energiequelle.']}
        lede="Eine Photovoltaikanlage ist kein Produkt, das man auf ein Dach legt. Sie ist das Ergebnis einer Analyse: welche Fläche trägt, welche Fläche liefert, und wohin der Strom danach geht."
        image={IMAGES.roofArchitecture}
        trail={TRAIL}
        variant="wide"
      />

      <Prose eyebrow="Das Problem" title="Nennleistung ist nicht Ertrag." align="left">
        <p>
          Die Zahl auf dem Angebot ist die Leistung unter Normbedingungen — 1.000 Watt Einstrahlung
          pro Quadratmeter, 25 Grad Zelltemperatur, senkrechter Lichteinfall. Diese Bedingungen
          herrschen auf einem Dach in Bayern an keinem einzigen Tag im Jahr.
        </p>
        <p>
          Was Ihre Anlage tatsächlich liefert, hängt an Dingen, die im Datenblatt nicht stehen:
          Neigung und Ausrichtung der Fläche, Verschattung durch Kamin, Gaube oder Nachbarbaum,
          Temperatur der Module im Sommer, Verschaltung der Strings und Wirkungsgrad des
          Wechselrichters bei Teillast.
        </p>
        <p>
          Deshalb beginnt unsere Planung nicht mit einer Kilowattzahl, sondern mit Ihrem Dach.
        </p>
      </Prose>

      <MediaBand
        image={IMAGES.solarDetailModule}
        width="inset"
        caption="Die Modulkante auf der Montageschiene. Zwischen Ziegel und Modul liegt die gesamte Statik der Anlage — und die Frage, ob das Dach in zwanzig Jahren noch dicht ist."
      />

      <Prose eyebrow="Die Analyse" title="Was wir uns ansehen, bevor wir rechnen." align="right">
        <ul>
          <li>
            <strong>Dachfläche und Neigung.</strong> Welche Teilflächen kommen in Frage, wie sind sie
            ausgerichtet, wie steil sind sie.
          </li>
          <li>
            <strong>Eindeckung und Statik.</strong> Zustand der Ziegel, Sparrenabstand, Tragreserve.
            Ein Dach, das in fünf Jahren saniert werden muss, ändert die Reihenfolge der Arbeiten.
          </li>
          <li>
            <strong>Verschattung über den Tagesverlauf.</strong> Kamin, Gauben, Dachfenster,
            Nachbarbebauung und Bewuchs — jeweils zu verschiedenen Jahreszeiten.
          </li>
          <li>
            <strong>Verbrauchsprofil.</strong> Wie viel Strom brauchen Sie, und wann. Ein Haushalt
            mit Homeoffice und Wärmepumpe hat ein anderes Profil als einer, der tagsüber leer steht.
          </li>
          <li>
            <strong>Zählerschrank und Leitungswege.</strong> Wo kann der Wechselrichter stehen, wie
            kommt das Kabel dorthin, ist Platz für einen späteren Speicher.
          </li>
        </ul>
        <p>
          Erst aus diesen fünf Punkten ergibt sich die Belegung — und damit eine Aussage, die für Ihr
          Gebäude gilt statt für ein Prospekt.
        </p>
      </Prose>

      <Prose eyebrow="Die Technik" title="Module, Wechselrichter, Verschaltung." align="left">
        <p>
          <strong>Module</strong> unterscheiden sich heute weniger im Wirkungsgrad als im Verhalten
          bei Teilverschattung, im Temperaturkoeffizienten und in der Garantieleistung. Wir wählen
          sie nach der Fläche aus, die sie belegen sollen, nicht nach dem höchsten Datenblattwert.
        </p>
        <p>
          <strong>Der Wechselrichter</strong> ist das Bauteil, das über die Lebensdauer am meisten
          arbeitet und als erstes altert. Wichtig sind sein Wirkungsgrad bei Teillast — dort läuft
          er die meiste Zeit — die Anzahl der MPP-Tracker für unterschiedlich ausgerichtete Flächen
          und die Frage, ob er speicherfähig ist.
        </p>
        <p>
          <strong>Die Verschaltung</strong> entscheidet, wie stark sich Verschattung auswirkt. Module
          in einem String teilen ihr Schicksal: Was einen trifft, begrenzt alle. Bei kritischen
          Flächen setzen wir Leistungsoptimierer, wo sie etwas bringen — und lassen sie weg, wo sie
          nur Kosten und ein zusätzliches Bauteil auf dem Dach bedeuten.
        </p>
      </Prose>

      <MediaBand
        image={IMAGES.pvInstallationRooftop}
        width="full"
        caption="Montage auf einem Ziegeldach. Jeder Dachhaken sitzt auf einem Sparren, jedes Modul mit definiertem Drehmoment."
      />

      <Prose eyebrow="Die Integration" title="Eine PV-Anlage allein ist die halbe Rechnung." align="right">
        <p>
          Ohne Speicher und ohne Steuerung geht der Strom dorthin, wo gerade Bedarf ist — und der
          Rest ins Netz. Der Eigenverbrauch einer reinen Photovoltaikanlage liegt in einem typischen
          Einfamilienhaus deutlich unter der Hälfte des Ertrags.
        </p>
        <p>
          Deshalb planen wir jede Anlage so, dass sie anschlussfähig bleibt: Reserve im
          Wechselrichter, Platz und Leitungsweg für einen Speicher, ein Zählerkonzept, das eine
          Wärmepumpe und eine Wallbox verträgt. Auch dann, wenn diese Komponenten erst in einigen
          Jahren dazukommen.
        </p>
        <p>
          Wie die Komponenten zusammenarbeiten, zeigen wir auf der Startseite Schritt für Schritt am
          Schnitt durch ein Haus.
        </p>
      </Prose>

      <Prose eyebrow="Die Umsetzung" title="Von der Montage bis zur Anmeldung." align="left" surface="light">
        <p>
          Gerüst, Dachhaken, Schienen, Module, Verkabelung, Wechselrichter, Zählerschrank,
          Inbetriebnahme. Die Elektroinstallation machen wir selbst — sie ist der Teil, an dem sich
          entscheidet, ob eine Anlage über Jahrzehnte störungsfrei läuft.
        </p>
        <p>
          Anmeldung beim Netzbetreiber, Inbetriebsetzung und Eintrag im Marktstammdatenregister
          übernehmen wir. Sie bekommen die Dokumentation der Anlage: Strangpläne, Datenblätter,
          Prüfprotokoll und Übergabe.
        </p>
      </Prose>

      <Faq entries={FAQ} />

      <PageCta
        headline="Fangen wir beim Dach an."
        body="Schicken Sie uns ein paar Fotos Ihres Dachs und Ihre letzte Stromabrechnung. Daraus lässt sich schon einiges sagen — und wir merken früh, ob sich der Aufwand für Sie lohnt."
      />
    </>
  );
}
