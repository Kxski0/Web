import Link from 'next/link';
import { Faq } from '@/components/page/Faq';
import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Prose } from '@/components/page/Prose';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Wärmepumpe — Planung beginnt bei den Heizflächen',
  description:
    'Eine Wärmepumpe arbeitet umso effizienter, je niedriger die Vorlauftemperatur ist. SolBauTec plant Wärmepumpen ausgehend von Gebäudehülle und Heizflächen und bindet sie in Photovoltaik und Speicher ein.',
  path: '/waermepumpe/',
  image: '/images/heat-pump-architecture.webp',
});

const TRAIL = [
  { name: 'Start', path: '/' },
  { name: 'Lösungen', path: '/#loesungen' },
  { name: 'Wärmepumpe', path: '/waermepumpe/' },
];

const FAQ = [
  {
    question: 'Funktioniert eine Wärmepumpe auch im Altbau?',
    answer:
      'Häufig ja — aber nicht automatisch. Entscheidend ist, mit welcher Vorlauftemperatur das Gebäude im tiefsten Winter warm wird. Liegt sie niedrig genug, arbeitet eine Wärmepumpe wirtschaftlich. Liegt sie zu hoch, sind zuerst größere Heizflächen oder Verbesserungen an der Gebäudehülle dran. Diese Frage lässt sich vor dem Einbau prüfen, unter anderem über einen Heizkurventest im Winterbetrieb.',
  },
  {
    question: 'Muss ich auf Fußbodenheizung umbauen?',
    answer:
      'Nicht zwingend. Fußbodenheizung ist ideal, weil sie mit sehr niedriger Vorlauftemperatur auskommt. Ausreichend groß dimensionierte Heizkörper oder der gezielte Tausch einzelner unterdimensionierter Heizkörper führen oft zum selben Ergebnis mit erheblich weniger Aufwand.',
  },
  {
    question: 'Wie laut ist eine Wärmepumpe?',
    answer:
      'Das hängt vom Gerät, vom Betriebspunkt und vor allem von der Aufstellung ab. Reflektierende Wände, Innenecken und die Nähe zu Schlafzimmerfenstern — beim Nachbarn wie bei Ihnen — verschlechtern die Situation erheblich. Aufstellort und Ausrichtung gehören deshalb in die Planung und nicht auf die Baustelle.',
  },
  {
    question: 'Lohnt sich die Kombination mit Photovoltaik?',
    answer:
      'Sie ist der größte Hebel im Haus, weil die Wärmepumpe der größte einzelne Stromverbraucher ist. Der Haken: Der Wärmebedarf ist im Winter am höchsten und der Solarertrag am niedrigsten. Den Sommer- und Übergangsbetrieb — Warmwasser und milde Tage — kann die Photovoltaik weitgehend tragen, den Januar nicht. Wer etwas anderes verspricht, rechnet nicht ehrlich.',
  },
  {
    question: 'Kann eine Wärmepumpe auch kühlen?',
    answer:
      'Viele Geräte können das, entweder passiv über die Fußbodenheizung oder aktiv durch Umkehr des Kreislaufs. Kühlen über den Fußboden ist träge und in der Leistung begrenzt, aber angenehm und leise. Ob es für Ihr Gebäude reicht, hängt von der Kühllast ab — siehe auch unsere Klimasysteme.',
  },
];

export default function WaermepumpePage() {
  return (
    <>
      <PageHero
        eyebrow="Lösung 03 · Wärmepumpe"
        headline={['Wärme, die mit', 'Ihrem Haus arbeitet.']}
        lede="Eine Wärmepumpe ist kein Kesseltausch. Sie ist eine Entscheidung über die Vorlauftemperatur des gesamten Gebäudes — und die fällt lange vor der Gerätewahl."
        image={IMAGES.heatPumpArchitecture}
        trail={TRAIL}
        variant="inset"
      />

      <Prose eyebrow="Das Prinzip" title="Sie erzeugt keine Wärme, sie holt sie." align="left">
        <p>
          Eine Wärmepumpe verbrennt nichts. Sie entzieht der Außenluft Wärme, hebt deren
          Temperaturniveau über einen Kältekreis an und gibt sie an das Heizsystem ab. Der Strom
          treibt dabei den Verdichter an — er ist nicht der Brennstoff, sondern der Antrieb.
        </p>
        <p>
          Daraus folgt die zentrale Größe: der Abstand zwischen der Temperatur, die sie aufnimmt, und
          der, die sie liefern muss. Je kleiner dieser Abstand, desto weniger Strom kostet dieselbe
          Menge Wärme. Jedes Grad weniger Vorlauftemperatur zählt.
        </p>
        <p>
          Deshalb ist die wichtigste Frage bei einer Wärmepumpe keine Frage an die Wärmepumpe.
        </p>
      </Prose>

      <Prose eyebrow="Die Planung" title="Vier Fragen vor der Gerätewahl." align="right">
        <ul>
          <li>
            <strong>Mit welcher Vorlauftemperatur wird das Haus im Winter warm?</strong> Die
            entscheidende Zahl. Sie lässt sich im laufenden Betrieb der alten Heizung ermitteln, statt
            sie zu schätzen.
          </li>
          <li>
            <strong>Sind die Heizflächen groß genug?</strong> Oft sind es einzelne unterdimensionierte
            Heizkörper, die die nötige Vorlauftemperatur des ganzen Hauses nach oben ziehen. Der Tausch
            dieser wenigen ist meist günstiger als ein größeres Gerät.
          </li>
          <li>
            <strong>Wie dicht und wie gedämmt ist die Hülle?</strong> Das bestimmt die Heizlast — und
            damit die Leistung, die überhaupt gebraucht wird.
          </li>
          <li>
            <strong>Wo kann das Außengerät stehen?</strong> Abstand zu Wänden und zur
            Grundstücksgrenze, Schallabstrahlung Richtung Nachbarschaft und Schlafräume,
            Kondensatableitung, Anfahrt für die Wartung.
          </li>
        </ul>
        <p>
          Erst danach steht fest, welches Gerät in welcher Leistungsklasse sinnvoll ist. Eine zu groß
          gewählte Wärmepumpe taktet im Übergangsbetrieb, und Takten kostet Effizienz und Lebensdauer.
        </p>
      </Prose>

      <MediaBand
        image={IMAGES.heatPumpInstallation}
        width="inset"
        caption="Hydraulischer Anschluss der Außeneinheit. Auf dem Fundament, mit Abstand zur Wand und mit einer Kondensatführung, die auch bei Frost funktioniert."
      />

      <Prose eyebrow="Die Integration" title="Der größte Verbraucher ist der größte Hebel." align="left">
        <p>
          Die Wärmepumpe ist in einem sanierten Einfamilienhaus in der Regel der größte einzelne
          Stromverbraucher. Genau deshalb ist sie für das Energiesystem so interessant: Wo viel
          verbraucht wird, kann viel eigener Strom hineinlaufen.
        </p>
        <p>
          Ehrlich bleibt dabei: Der Wärmebedarf ist dann am höchsten, wenn die Photovoltaik am
          wenigsten liefert. Was gut funktioniert, ist der Übergangs- und Sommerbetrieb — Warmwasser
          und milde Tage — sowie das gezielte Vorheizen an sonnigen Wintertagen, gesteuert vom
          Energiemanagement.
        </p>
        <p>
          Was nicht funktioniert, ist eine Wärmepumpe im Januar aus dem Hausspeicher zu betreiben.
          Diese Rechnung geht in unseren Breiten nicht auf, und wir stellen sie auch nicht so dar.
        </p>
      </Prose>

      <Prose eyebrow="Die Umsetzung" title="Hydraulik, Elektrik, Einregulierung." align="right" surface="light">
        <p>
          Fundament und Aufstellung, hydraulische Einbindung, Pufferspeicher wo nötig,
          Elektroanschluss und Absicherung, Inbetriebnahme. Dazu die Anmeldung beim Netzbetreiber,
          da Wärmepumpen als steuerbare Verbrauchseinrichtungen angemeldet werden.
        </p>
        <p>
          Der Teil, den viele auslassen, ist die Einregulierung: Heizkurve, Hysterese,
          Warmwasserbereitung und hydraulischer Abgleich. Eine gut eingestellte Wärmepumpe
          unterscheidet sich von einer schlecht eingestellten um einen erheblichen Teil der
          Jahresarbeitszahl — bei identischem Gerät.
        </p>
        <p>
          Für Gebäude in Augsburg kommen das bayerische Abstandsflächenrecht und die kommunale
          Wärmeplanung dazu. Beides steht auf der Seite zur
          <Link href="/waermepumpe-augsburg/">Wärmepumpe in Augsburg</Link>.
        </p>
      </Prose>

      <Prose eyebrow="Die Kennzahl" title="Die Jahresarbeitszahl entsteht nach dem Einbau." align="right">
        <p>
          Der COP im Datenblatt beschreibt ein Gerät auf einem Prüfstand bei definierten
          Temperaturen. Was Sie am Ende bezahlen, entscheidet die Jahresarbeitszahl — und die ist zu
          großen Teilen kein Produktmerkmal, sondern das Ergebnis der Installation.
        </p>
        <p>
          <strong>Die Vorlauftemperatur</strong> ist der stärkste Hebel. Jedes Grad weniger kostet
          den Verdichter spürbar weniger Arbeit. Deshalb ist der hydraulische Abgleich der
          Heizflächen keine Feinarbeit am Schluss, sondern eine der wenigen Maßnahmen mit direkter
          Wirkung auf die Stromrechnung.
        </p>
        <p>
          <strong>Das Takten</strong> ist der zweite. Eine überdimensionierte Wärmepumpe erreicht
          ihre Zieltemperatur zu schnell, schaltet ab, kühlt aus und startet erneut. Jeder Start
          kostet Wirkungsgrad und Lebensdauer. Ein Gerät, das kleiner ausgelegt ist und länger
          durchläuft, ist in der Praxis fast immer das effizientere.
        </p>
        <p>
          <strong>Die Warmwasserbereitung</strong> ist der dritte. Sie verlangt die höchsten
          Temperaturen im ganzen System und drückt den Jahreswert entsprechend. Wo sie zeitlich in
          die Mittagsstunden gelegt werden kann, arbeitet sie mit der Erzeugung statt gegen sie.
        </p>
      </Prose>

      <Faq entries={FAQ} />

      <PageCta
        headline="Prüfen wir zuerst Ihre Vorlauftemperatur."
        body="Bevor über Geräte gesprochen wird, sehen wir uns Heizkörper, Heizkurve und Verbrauch an. Das Ergebnis sagt Ihnen, ob eine Wärmepumpe in Ihrem Gebäude wirtschaftlich läuft — und was gegebenenfalls vorher zu tun ist."
      />
    </>
  );
}
