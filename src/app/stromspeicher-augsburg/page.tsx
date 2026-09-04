import Link from 'next/link';
import { DayCurve } from '@/components/page/DayCurve';
import { Faq } from '@/components/page/Faq';
import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Prose } from '@/components/page/Prose';
import { SourceList } from '@/components/page/SourceList';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Stromspeicher Augsburg — Auslegung, Anmeldung, Nachrüstung',
  description:
    'Stromspeicher in Augsburg: Anmeldung bei LEW Verteilnetz und im Marktstammdatenregister, § 14a EnWG, Nachrüstung an eine bestehende PV-Anlage. Auslegung nach Ihrem Verbrauch statt nach Faustformel.',
  path: '/stromspeicher-augsburg/',
  image: '/images/battery-storage-detail.webp',
});

const TRAIL = [
  { name: 'Start', path: '/' },
  { name: 'Stromspeicher', path: '/stromspeicher/' },
  { name: 'Augsburg', path: '/stromspeicher-augsburg/' },
];

const SOURCES = [
  {
    claim:
      'Verteilnetzbetreiber für Augsburg ist LEW Verteilnetz. Speicher werden dort zusammen mit der Erzeugungsanlage angemeldet; einreichen kann das nur ein eingetragener Elektrofachbetrieb.',
    source: 'LEW Verteilnetz GmbH',
    href: 'https://www.lew-verteilnetz.de/',
  },
  {
    claim:
      'Batteriespeicher zählen zu den steuerbaren Verbrauchseinrichtungen nach § 14a EnWG. Eine Reduzierung durch den Netzbetreiber darf eine einzelne Anlage nicht unter 4,2 Kilowatt bringen.',
    source: 'LEW Verteilnetz, Steuerbare Verbrauchseinrichtungen',
    href: 'https://www.lew-verteilnetz.de/lew-verteilnetz/fuer-netzkunden/steuerbare-verbrauchseinrichtungen',
  },
  {
    claim:
      'Speicher sind im Marktstammdatenregister der Bundesnetzagentur einzutragen — auch dann, wenn sie zu einer bereits registrierten Photovoltaikanlage nachgerüstet werden.',
    source: 'Bundesnetzagentur, Marktstammdatenregister',
    href: 'https://www.marktstammdatenregister.de/MaStR',
  },
  {
    claim:
      'Die kommunale Wärmeplanung der Stadt Augsburg weist Eignungsgebiete für Wärmenetz, dezentrale Versorgung, Wasserstoffnetz und weitere Prüfung aus. Sie bestimmt mit, ob im Gebäude langfristig ein großer elektrischer Wärmeverbraucher entsteht.',
    source: 'Stadt Augsburg, Kommunale Wärmeplanung',
    href: 'https://www.augsburg.de/umwelt-soziales/umwelt/klima-energie/waermeplanung',
  },
];

const FAQ = [
  {
    question: 'Muss ich den Speicher anmelden?',
    answer:
      'Ja, an zwei Stellen. Beim Netzbetreiber LEW Verteilnetz, weil sich das Verhalten Ihrer Anlage am Netzverknüpfungspunkt ändert und Batteriespeicher als steuerbare Verbrauchseinrichtung nach § 14a EnWG gelten — einreichen kann das nur ein bei LVN eingetragener Elektrofachbetrieb. Und im Marktstammdatenregister der Bundesnetzagentur, auch dann, wenn die Photovoltaikanlage dort längst steht. Beides übernehmen wir.',
  },
  {
    question: 'Wie groß sollte der Speicher sein?',
    answer:
      'Er wird aus Ihrem Verbrauch abgeleitet, nicht aus der Anlagengröße. Die verbreitete Faustformel „eine Kilowattstunde Speicher je Kilowatt Modulleistung“ ist eine Verkaufshilfe, keine Auslegung. Maßgeblich ist, wie viel Energie zwischen dem abendlichen Ende der Erzeugung und dem morgendlichen Wiederbeginn tatsächlich gebraucht wird — und ob eine Wärmepumpe oder ein Fahrzeug diesen Bedarf verschiebt. Ein zu großer Speicher steht die halbe Zeit halb leer und altert trotzdem.',
  },
  {
    question: 'Kann ich einen Speicher an meine bestehende Anlage nachrüsten?',
    answer:
      'In der Regel ja. Die Frage ist, ob AC- oder DC-seitig. AC-gekoppelt heißt: ein eigener Batteriewechselrichter, unabhängig vom vorhandenen Gerät, funktioniert an fast jeder Anlage, kostet einen zusätzlichen Umwandlungsschritt. DC-gekoppelt heißt: der vorhandene Wechselrichter muss speicherfähig sein oder wird getauscht, dafür entfällt ein Wandlungsverlust. Welche Variante sinnvoll ist, entscheidet das vorhandene Gerät, nicht die Vorliebe des Installateurs.',
  },
  {
    question: 'Bringt mir ein Speicher eine Notstromversorgung?',
    answer:
      'Nur, wenn er ausdrücklich dafür ausgelegt ist, und die Unterschiede sind groß. Eine Ersatzstromsteckdose versorgt ein einzelnes Gerät. Eine Ersatzstromfunktion versorgt nach einer kurzen Unterbrechung ausgewählte Stromkreise. Eine echte unterbrechungsfreie Inselversorgung des ganzen Hauses ist ein anderer, deutlich aufwendigerer Aufbau mit eigener Netztrennstelle. Sagen Sie uns, was im Ernstfall laufen soll — daraus folgt die Bauart, nicht umgekehrt.',
  },
  {
    question: 'Was hat die Augsburger Wärmeplanung mit meinem Speicher zu tun?',
    answer:
      'Indirekt viel. Liegt Ihr Gebäude in einem Gebiet für dezentrale Versorgung, wird die Wärme dort auf absehbare Zeit im Haus erzeugt — meist elektrisch. Damit entsteht der mit Abstand größte Stromverbraucher im Gebäude, und ein Speicher, der ohne diesen Verbraucher ausgelegt wurde, passt danach nicht mehr. Wir sehen uns die Einordnung deshalb an, bevor wir die Kapazität festlegen.',
  },
];

export default function StromspeicherAugsburgPage() {
  return (
    <>
      <PageHero
        eyebrow="Region · Augsburg"
        headline={['Stromspeicher', 'in Augsburg.']}
        lede="Eine Batterie verhält sich hier nicht anders als anderswo. Regional sind der Anmeldeweg, die Regeln zur Steuerbarkeit und die Frage, welcher Verbraucher in Ihrem Gebäude als Nächstes dazukommt."
        image={IMAGES.batteryStorageDetail}
        trail={TRAIL}
        variant="wide"
      />

      <Prose eyebrow="Ehrlich vorweg" title="Der Speicher selbst ist unregional." align="left">
        <p>
          Wir könnten an dieser Stelle über die Sonnenstunden im Augsburger Sommer schreiben und so
          tun, als folge daraus eine besondere Speicherstrategie. Es folgt keine. Eine
          Lithium-Eisenphosphat-Zelle interessiert sich nicht für Stadtgrenzen, und die Auslegung
          folgt Ihrem Haushalt, nicht Ihrer Postleitzahl.
        </p>
        <p>
          Was hier wirklich lokal ist, sind drei Dinge: der Netzbetreiber und der Weg, über den ein
          Speicher angemeldet wird; die Regeln zur Steuerbarkeit, die über Ihr Netzentgelt
          entscheiden; und die kommunale Wärmeplanung, weil sie bestimmt, ob in Ihrem Gebäude
          langfristig eine Wärmepumpe steht — und damit, wie groß der Speicher überhaupt sein muss.
        </p>
        <p>
          Die Technik dahinter erklären wir auf der{' '}
          <Link href="/stromspeicher/">Seite zum Stromspeicher</Link>. Hier steht, was in Augsburg
          dazukommt.
        </p>
      </Prose>

      <DayCurve />

      <Prose eyebrow="Auslegung" title="Die Kapazität folgt der Lücke, nicht der Anlagengröße." align="right">
        <p>
          Die Kurve oben ist das ganze Argument. Die Erzeugung hat eine Spitze um die Mittagszeit,
          der Haushalt hat zwei — morgens und abends. Der Speicher hat genau eine Aufgabe: den
          mittäglichen Überschuss über die Lücke bis zum nächsten Morgen zu tragen.
        </p>
        <p>
          Daraus ergibt sich die Auslegung. <strong>Maßgeblich ist der Abendverbrauch</strong>,
          nicht die installierte Modulleistung. Wir sehen uns dafür Ihre Verbrauchswerte an, und wo
          ein intelligentes Messsystem verbaut ist, die tatsächlichen Viertelstundenwerte statt eines
          Jahresmittels.
        </p>
        <p>
          Die Faustformel „eine Kilowattstunde Speicher je Kilowatt Modulleistung“ liefert
          zufällig oft ein brauchbares Ergebnis und häufig genug ein falsches. Ein Haushalt, der
          tagsüber leer steht, braucht mehr Speicher als die Formel sagt; einer mit Homeoffice und
          Wärmepumpe braucht weniger Speicher und mehr Steuerung.
        </p>
        <p>
          Und ein zu großer Speicher ist kein sicherer Weg: Er kostet mehr, wird seltener voll
          durchgeladen, und er altert kalendarisch weiter, ob er arbeitet oder nicht.
        </p>
      </Prose>

      <MediaBand
        image={IMAGES.batteryStorageDetail}
        width="inset"
        caption="Der Speicher im Technikraum. Was hier zählt, ist nicht die Zellchemie im Prospekt, sondern die Zyklenzahl, die er in Ihrem Haushalt tatsächlich fährt."
      />

      <Prose eyebrow="Anmeldung" title="Zwei Register, ein Fachbetrieb." align="left">
        <p>
          <strong>LEW Verteilnetz.</strong> Ein Speicher verändert das Verhalten Ihrer Anlage am
          Netzverknüpfungspunkt und wird deshalb beim Netzbetreiber angemeldet — auch als
          Nachrüstung an eine bestehende Photovoltaikanlage. Einreichen kann das nur ein bei LVN
          eingetragener Elektrofachbetrieb.
        </p>
        <p>
          <strong>Marktstammdatenregister.</strong> Der Speicher bekommt einen eigenen Eintrag bei
          der Bundesnetzagentur. Dass die Photovoltaikanlage dort schon steht, ersetzt ihn nicht.
        </p>
        <p>
          <strong>§ 14a EnWG.</strong> Batteriespeicher zählen zu den steuerbaren
          Verbrauchseinrichtungen. Der Netzbetreiber darf den Bezug im Engpassfall reduzieren, nie
          unter 4,2 Kilowatt je Anlage — für Sie im Alltag praktisch unsichtbar, weil ein Speicher
          seinen Ladezeitpunkt ohnehin verschieben kann. Im Gegenzug gelten reduzierte Netzentgelte.
        </p>
        <p>
          Alle drei Schritte übernehmen wir und übergeben Ihnen die Bestätigungen mit der
          Anlagendokumentation.
        </p>
      </Prose>

      <Prose eyebrow="Nachrüstung" title="AC oder DC — das entscheidet Ihr vorhandener Wechselrichter." align="right">
        <p>
          Viele Häuser im Augsburger Bestand haben seit einigen Jahren eine Photovoltaikanlage ohne
          Speicher. Nachrüsten geht fast immer, aber auf zwei verschiedenen Wegen.
        </p>
        <ul>
          <li>
            <strong>AC-gekoppelt.</strong> Der Speicher bekommt einen eigenen Batteriewechselrichter
            und hängt auf der Wechselstromseite. Funktioniert unabhängig vom vorhandenen Gerät und
            ist der robuste Standardweg im Bestand. Preis dafür ist ein zusätzlicher
            Umwandlungsschritt.
          </li>
          <li>
            <strong>DC-gekoppelt.</strong> Der Speicher hängt direkt auf der Gleichstromseite. Setzt
            voraus, dass der vorhandene Wechselrichter speicherfähig ist — sonst wird er getauscht.
            Dafür entfällt eine Wandlung.
          </li>
        </ul>
        <p>
          Welcher Weg der richtige ist, ergibt sich aus dem Typ und dem Alter Ihres Wechselrichters
          und aus der Frage, wie lange er ohnehin noch laufen soll. Wir sehen uns das Gerät an,
          bevor wir einen Speicher vorschlagen.
        </p>
        <p>
          Und wenn ohnehin eine <Link href="/waermepumpe-augsburg/">Wärmepumpe</Link> ansteht: Dann
          gehören beide Entscheidungen in eine Planung, nicht in zwei Angebote.
        </p>
      </Prose>

      <SourceList
        intro="Anmeldepflichten und Netzentgeltregeln ändern sich. Was auf dieser Seite regional oder rechtlich behauptet wird, steht hier mit seiner Quelle."
        entries={SOURCES}
      />

      <Faq entries={FAQ} />

      <PageCta
        headline="Sagen Sie uns, was abends läuft."
        body="Für eine Auslegung brauchen wir Ihren Jahresverbrauch, die Daten Ihrer bestehenden Anlage — falls vorhanden — und eine Einschätzung, was in den nächsten Jahren dazukommt. Daraus wird eine Kapazität statt einer Faustformel."
      />
    </>
  );
}
