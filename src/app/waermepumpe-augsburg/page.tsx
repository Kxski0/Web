import Link from 'next/link';
import { Faq } from '@/components/page/Faq';
import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Prose } from '@/components/page/Prose';
import { SourceList } from '@/components/page/SourceList';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Wärmepumpe Augsburg — Abstandsflächen, Wärmeplanung, §14a',
  description:
    'Wärmepumpe in Augsburg: Abstandsflächen nach BayBO, kommunale Wärmeplanung und Eignungsgebiete, Anmeldung als steuerbare Verbrauchseinrichtung bei LEW Verteilnetz. Die lokalen Rahmenbedingungen, belegt.',
  path: '/waermepumpe-augsburg/',
  image: '/images/heat-pump-architecture.webp',
});

const TRAIL = [
  { name: 'Start', path: '/' },
  { name: 'Wärmepumpe', path: '/waermepumpe/' },
  { name: 'Augsburg', path: '/waermepumpe-augsburg/' },
];

const SOURCES = [
  {
    claim:
      'Nach der Bayerischen Bauordnung lösen Wärmepumpen und ihre Einhausungen bis zwei Meter Höhe keine Abstandsflächen aus. Die Klarstellung gilt seit der Novelle zum 1. Januar 2025.',
    source: 'Bayerische Bauordnung (BayBO), Art. 6',
    href: 'https://www.gesetze-bayern.de/Content/Document/BayBO-6',
  },
  {
    claim:
      'Unabhängig vom Bauordnungsrecht bleibt der Immissionsschutz maßgeblich: Geräusche sind nach § 22 BImSchG und der TA Lärm zu begrenzen. Für allgemeine Wohngebiete gelten nachts deutlich strengere Werte als tagsüber.',
    source: 'Bundes-Immissionsschutzgesetz und TA Lärm',
    href: 'https://www.gesetze-im-internet.de/bimschg/__22.html',
  },
  {
    claim:
      'Die Stadt Augsburg hat ihren Energienutzungsplan Wärme zu einer kommunalen Wärmeplanung nach dem Wärmeplanungsgesetz fortgeschrieben. Der Entwurf lag im Frühjahr 2026 öffentlich aus.',
    source: 'Stadt Augsburg, Kommunale Wärmeplanung',
    href: 'https://www.augsburg.de/umwelt-soziales/umwelt/klima-energie/waermeplanung',
  },
  {
    claim:
      'Die Wärmeplanung weist Eignungsgebiete aus und unterscheidet dabei zwischen Wärmenetzgebiet, dezentraler Versorgung, Wasserstoffnetzgebiet und Prüfgebiet. Ziel ist eine weitgehend klimaneutrale Wärmeversorgung bis spätestens 2040.',
    source: 'Stadt Augsburg, Kommunale Wärmeplanung',
    href: 'https://www.augsburg.de/umwelt-soziales/umwelt/klima-energie/waermeplanung',
  },
  {
    claim:
      'Wärmepumpen gelten als steuerbare Verbrauchseinrichtung nach § 14a EnWG. Die Anmeldung beim Netzbetreiber ist nur über einen eingetragenen Elektrofachbetrieb möglich; im Gegenzug gelten reduzierte Netzentgelte.',
    source: 'LEW Verteilnetz, Steuerbare Verbrauchseinrichtungen',
    href: 'https://www.lew-verteilnetz.de/lew-verteilnetz/fuer-netzkunden/steuerbare-verbrauchseinrichtungen',
  },
];

const FAQ = [
  {
    question: 'Wie weit muss die Wärmepumpe in Bayern von der Grundstücksgrenze weg?',
    answer:
      'Aus Sicht des Abstandsflächenrechts: gar nicht. Die Bayerische Bauordnung stellt seit der Novelle zum 1. Januar 2025 klar, dass Wärmepumpen und ihre Einhausungen bis zwei Meter Höhe keine gebäudegleiche Wirkung haben und damit keine Abstandsflächen auslösen. Die frühere Unsicherheit um drei Meter Abstand ist damit erledigt. Was bleibt, ist der Lärmschutz — und der ist in der Praxis die eigentliche Beschränkung.',
  },
  {
    question: 'Heißt das, ich kann sie direkt an den Zaun stellen?',
    answer:
      'Baurechtlich meist ja, praktisch selten sinnvoll. Maßgeblich ist § 22 BImSchG mit der TA Lärm, und die Nachtwerte im allgemeinen Wohngebiet sind der kritische Punkt, weil eine Wärmepumpe an kalten Nächten unter Volllast läuft. Je näher das Gerät am nächsten schutzbedürftigen Fenster steht, desto weniger Reserve haben Sie. Wir rechnen den Schalldruck am maßgeblichen Immissionsort aus, bevor der Standort feststeht — nicht danach.',
  },
  {
    question: 'Soll ich auf den Fernwärmeausbau warten?',
    answer:
      'Das hängt daran, in welchem Eignungsgebiet Ihre Adresse in der kommunalen Wärmeplanung liegt. Die Planung unterscheidet Wärmenetzgebiete, Gebiete für dezentrale Versorgung, Wasserstoffnetzgebiete und Prüfgebiete. Liegt Ihr Gebäude in einem Bereich, für den kein Netz vorgesehen ist, ist die Entscheidung faktisch getroffen. Liegt es in einem Netzgebiet, ist die Frage der Zeitpunkt — und eine Heizung, die jetzt ausfällt, wartet nicht auf einen Bauabschnitt in einigen Jahren. Ein Wärmeplan ist eine Planungsgrundlage, kein Anschlussversprechen.',
  },
  {
    question: 'Was ändert § 14a EnWG für mich?',
    answer:
      'Ihre Wärmepumpe wird als steuerbare Verbrauchseinrichtung beim Netzbetreiber angemeldet und ist damit für LEW Verteilnetz im Ausnahmefall drosselbar. Dafür bekommen Sie reduzierte Netzentgelte. Die Drosselung darf eine einzelne Anlage nie unter 4,2 Kilowatt bringen — das reicht, um ein Haus weiter zu beheizen. Wichtiger als die Angst vor dem Eingriff ist die Frage, ob Ihr Gebäude die kurze Reduzierung überhaupt merkt; ein ausreichend träger Heizkreis und ein Pufferspeicher machen sie unsichtbar.',
  },
  {
    question: 'Funktioniert eine Wärmepumpe in einem Augsburger Altbau?',
    answer:
      'In vielen Fällen ja — die Frage ist die Vorlauftemperatur, nicht das Baujahr. Entscheidend ist, welche Temperatur die vorhandenen Heizflächen am kältesten Tag brauchen. Das lässt sich messen, indem man die bestehende Heizung an einem kalten Tag herunterregelt und beobachtet, ab wann es nicht mehr warm wird. Diese Messung ist mehr wert als jede Faustregel über Altbauten, und sie kostet nichts außer einem Wochenende Geduld.',
  },
];

export default function WaermepumpeAugsburgPage() {
  return (
    <>
      <PageHero
        eyebrow="Region · Augsburg"
        headline={['Wärmepumpe', 'in Augsburg.']}
        lede="Drei lokale Rahmenbedingungen entscheiden hier mehr über Ihr Projekt als die Gerätewahl: das bayerische Abstandsflächenrecht, die kommunale Wärmeplanung der Stadt und die Anmeldung bei LEW Verteilnetz."
        image={IMAGES.heatPumpArchitecture}
        trail={TRAIL}
        variant="split"
      />

      <Prose eyebrow="Bauordnungsrecht" title="Bayern hat die Abstandsfrage geklärt." align="left">
        <p>
          Jahrelang war der Abstand zur Grundstücksgrenze der häufigste Streitpunkt bei
          Luft-Wasser-Wärmepumpen in Bayern. Strittig war, ob ein Außengerät eine
          „gebäudegleiche Wirkung“ im Sinne des Abstandsflächenrechts hat. Wo Bauämter das bejahten,
          landete man schnell bei drei Metern — und damit bei Grundstücken, auf denen kein zulässiger
          Standort mehr übrig blieb.
        </p>
        <p>
          Mit der Novelle der Bayerischen Bauordnung zum 1. Januar 2025 ist das geklärt:{' '}
          <strong>
            Wärmepumpen und ihre Einhausungen bis zwei Meter Höhe über der Geländeoberfläche lösen
            keine Abstandsflächen aus.
          </strong>{' '}
          Baurechtlich dürfen sie damit auch grenznah stehen.
        </p>
        <p>
          Das ist eine echte Erleichterung — und gleichzeitig der Punkt, an dem viele Anbieter
          aufhören zu erzählen. Denn die Beschränkung ist damit nicht weg, sie hat nur ihren Namen
          gewechselt.
        </p>
      </Prose>

      <Prose eyebrow="Immissionsschutz" title="Was den Standort wirklich bestimmt, ist der Schall." align="right">
        <p>
          Unabhängig vom Bauordnungsrecht gilt § 22 des Bundes-Immissionsschutzgesetzes mit der TA
          Lärm. Maßgeblich ist der Schalldruckpegel am nächsten schutzbedürftigen Raum der
          Nachbarschaft — in der Regel ein Fenster — und dort besonders der Nachtwert.
        </p>
        <p>
          Das ist deshalb der kritische Fall, weil eine Wärmepumpe genau dann am lautesten läuft,
          wenn sie am meisten gebraucht wird: in kalten Nächten, unter hoher Last, oft mit
          Abtauzyklen. Ein Gerät, das im Datenblatt leise wirkt, kann an der falschen Stelle im
          Grundstück trotzdem zum Problem werden.
        </p>
        <p>
          <strong>Wie wir das behandeln:</strong> Der Standort wird gerechnet, nicht geschätzt. In
          die Rechnung gehen der Schallleistungspegel des Geräts, der Abstand zum maßgeblichen
          Immissionsort, die Aufstellsituation — frei, an einer Wand, in einer Ecke zwischen zwei
          Wänden — und reflektierende Flächen ein. Aus dem Ergebnis folgt der Standort, und wenn er
          nicht reicht, folgen daraus Maßnahmen: eine andere Ausblasrichtung, ein Schallschutzsockel,
          eine Nachtabsenkung der Verdichterdrehzahl.
        </p>
        <p>
          Der Nebeneffekt ist ein sozialer: Ein Gerät, das den Nachbarn nicht stört, bleibt stehen.
          Eines, das stört, wird über Jahre zum Thema.
        </p>
      </Prose>

      <MediaBand
        image={IMAGES.heatPumpInstallation}
        width="inset"
        caption="Hydraulischer Anschluss im Technikraum. Der Standort des Außengeräts entscheidet über die Akzeptanz, die Hydraulik über die Jahresarbeitszahl."
      />

      <Prose eyebrow="Kommunale Wärmeplanung" title="Prüfen Sie zuerst, in welchem Gebiet Sie liegen." align="left">
        <p>
          Die Stadt Augsburg hat ihren Energienutzungsplan Wärme zu einer kommunalen Wärmeplanung
          nach dem Wärmeplanungsgesetz fortgeschrieben; der Entwurf lag im Frühjahr 2026 öffentlich
          aus. Für Sie als Eigentümerin oder Eigentümer ist daran ein Punkt entscheidend: Die Planung
          arbeitet nicht mit stadtweiten Durchschnitten, sondern mit{' '}
          <strong>kartierten Eignungsgebieten</strong>.
        </p>
        <ul>
          <li>
            <strong>Wärmenetzgebiet.</strong> Ein leitungsgebundener Anschluss ist hier
            perspektivisch vorgesehen.
          </li>
          <li>
            <strong>Dezentrale Versorgung.</strong> Ein Netz ist nicht wirtschaftlich darstellbar —
            die Wärmeerzeugung bleibt Sache des Gebäudes.
          </li>
          <li>
            <strong>Wasserstoffnetzgebiet.</strong> Ein eigener Pfad mit eigenen Voraussetzungen.
          </li>
          <li>
            <strong>Prüfgebiet.</strong> Noch nicht entschieden, weitere Untersuchung nötig.
          </li>
        </ul>
        <p>
          Liegt Ihr Gebäude in einem Gebiet für dezentrale Versorgung, ist die grundsätzliche
          Richtung damit vorgezeichnet. Liegt es in einem Netzgebiet, wird die Frage zur
          Zeitfrage — und ein Wärmeplan ist eine Planungsgrundlage, kein Anschlussversprechen und
          kein Termin. Wenn Ihre Heizung jetzt am Ende ist, wartet sie nicht auf einen Bauabschnitt.
        </p>
        <p>
          Wir sehen uns diese Einordnung vor der Auslegung an. Sie ändert nicht die Technik, aber sie
          ändert die Wirtschaftlichkeitsrechnung und manchmal die Reihenfolge.
        </p>
      </Prose>

      <Prose eyebrow="Netzbetreiber" title="§ 14a und die Anmeldung bei LEW Verteilnetz." align="right">
        <p>
          Ihre Wärmepumpe ist eine steuerbare Verbrauchseinrichtung im Sinne von § 14a EnWG. Sie wird
          bei LEW Verteilnetz angemeldet — wie bei der{' '}
          <Link href="/photovoltaik-augsburg/">Photovoltaikanlage</Link> ausschließlich über einen bei
          LVN eingetragenen Elektrofachbetrieb — und ist damit im Netzengpassfall vom Netzbetreiber
          reduzierbar.
        </p>
        <p>
          <strong>Der Gegenwert</strong> sind reduzierte Netzentgelte. Die Reduzierung darf eine
          einzelne Anlage dabei nie unter 4,2 Kilowatt drücken. Ein Haus wird in dieser Zeit also
          weiter beheizt, nur langsamer — und ein Heizsystem mit ausreichend träger Masse oder einem
          Pufferspeicher merkt davon nichts.
        </p>
        <p>
          Interessanter als die Pflicht ist die Kür: Wer zusätzlich ein intelligentes Messsystem hat,
          kann zeitvariable Netzentgelte wählen und den Verbrauch in die günstigen Zeitfenster legen.
          Das lohnt sich aber nur, wenn etwas im Haus diese Verschiebung auch tatsächlich ausführt.
          Genau dafür ist das{' '}
          <Link href="/energiemanagement-augsburg/">Energiemanagement</Link> da.
        </p>
      </Prose>

      <SourceList
        intro="Bauordnung, Immissionsschutz und Wärmeplanung ändern sich. Jede regionale Angabe auf dieser Seite steht hier mit ihrer Quelle."
        entries={SOURCES}
      />

      <Prose eyebrow="Vorgehen" title="Was wir vor der Gerätewahl klären." align="left" surface="light">
        <p>
          <strong>Heizlast statt Kesselleistung.</strong> Die alte Anlage ist fast immer
          überdimensioniert und taugt nicht als Maßstab. Wir rechnen die Heizlast und prüfen, welche
          Vorlauftemperatur die vorhandenen Heizflächen am kältesten Tag wirklich brauchen.
        </p>
        <p>
          <strong>Standort und Schall.</strong> Aufstellort, Ausblasrichtung, Abstand zum nächsten
          schutzbedürftigen Fenster, Reflexionen — gerechnet, mit Reserve zum Nachtwert.
        </p>
        <p>
          <strong>Einordnung in die Wärmeplanung.</strong> In welchem Eignungsgebiet liegt das
          Gebäude, und was heißt das für die Wirtschaftlichkeit über die Lebensdauer.
        </p>
        <p>
          <strong>Stromseite.</strong> Zählerschrank, Anmeldung nach § 14a bei LVN und die Frage, ob
          eine bestehende oder geplante <Link href="/photovoltaik/">Photovoltaikanlage</Link> und ein{' '}
          <Link href="/stromspeicher-augsburg/">Speicher</Link> die Wärmepumpe mitversorgen sollen.
        </p>
      </Prose>

      <Faq entries={FAQ} />

      <PageCta
        headline="Fangen wir mit Ihrer Vorlauftemperatur an."
        body="Für eine erste belastbare Einschätzung reichen Baujahr, beheizte Fläche, Art der Heizflächen und der Gas- oder Ölverbrauch der letzten drei Jahre. Den Standort und den Schall sehen wir uns vor Ort an."
      />
    </>
  );
}
