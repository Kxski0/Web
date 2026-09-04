import Link from 'next/link';
import { Faq } from '@/components/page/Faq';
import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { PriorityLadder } from '@/components/page/PriorityLadder';
import { Prose } from '@/components/page/Prose';
import { SourceList } from '@/components/page/SourceList';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Energiemanagement Augsburg — § 14a EnWG, Netzentgelte, Steuerung',
  description:
    'Energiemanagement in Augsburg: steuerbare Verbrauchseinrichtungen nach § 14a EnWG bei LEW Verteilnetz, zeitvariable Netzentgelte mit intelligentem Messsystem und die Steuerung, die daraus tatsächlich einen Vorteil macht.',
  path: '/energiemanagement-augsburg/',
  image: '/images/energy-management.webp',
});

const TRAIL = [
  { name: 'Start', path: '/' },
  { name: 'Energiemanagement', path: '/energiemanagement/' },
  { name: 'Augsburg', path: '/energiemanagement-augsburg/' },
];

const SOURCES = [
  {
    claim:
      'Steuerbare Verbrauchseinrichtungen nach § 14a EnWG sind unter anderem Wärmepumpen, nicht öffentliche Ladeeinrichtungen, Klimageräte und Batteriespeicher. Anmelden kann sie beim Netzbetreiber nur ein eingetragener Elektrofachbetrieb.',
    source: 'LEW Verteilnetz, Steuerbare Verbrauchseinrichtungen',
    href: 'https://www.lew-verteilnetz.de/lew-verteilnetz/fuer-netzkunden/steuerbare-verbrauchseinrichtungen',
  },
  {
    claim:
      'Eine netzdienliche Reduzierung darf eine einzelne steuerbare Verbrauchseinrichtung nicht unter 4,2 Kilowatt bringen.',
    source: 'Bundesnetzagentur, Festlegung zu § 14a EnWG',
    href: 'https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/Verteilernetze/14aEnWG/start.html',
  },
  {
    claim:
      'Zusätzlich zur pauschalen Netzentgeltreduzierung nach Modul 1 lassen sich zeitvariable Netzentgelte nach Modul 3 wählen. Voraussetzung ist ein intelligentes Messsystem; der Netzbetreiber legt dabei drei Preisstufen je Tag fest.',
    source: 'LEW, § 14a EnWG: Steuerbare Verbrauchseinrichtungen',
    href: 'https://www.lew.de/fuer-zuhause/waerme/waermepumpe/steuerbare-verbrauchseinrichtungen',
  },
  {
    claim:
      'Die kommunale Wärmeplanung der Stadt Augsburg ordnet Teilgebiete Entwicklungspfaden zu und zielt auf eine weitgehend klimaneutrale Wärmeversorgung bis spätestens 2040.',
    source: 'Stadt Augsburg, Kommunale Wärmeplanung',
    href: 'https://www.augsburg.de/umwelt-soziales/umwelt/klima-energie/waermeplanung',
  },
];

const FAQ = [
  {
    question: 'Brauche ich ein Energiemanagement, oder reicht die App vom Hersteller?',
    answer:
      'Solange nur Photovoltaik und Speicher im Haus sind, reicht die Herstellerlösung meist aus — dort gibt es wenig zu entscheiden. Sobald ein zweiter großer Verbraucher dazukommt, also Wärmepumpe, Wallbox oder beides, entstehen echte Zielkonflikte: Wer bekommt den Überschuss zuerst? Diese Frage beantwortet keine Anzeige, sondern eine Regel. Ein Energiemanagement ist die Instanz, die diese Regel ausführt.',
  },
  {
    question: 'Was bedeutet § 14a EnWG konkret für den Alltag?',
    answer:
      'Wärmepumpe, Wallbox, Klimagerät und Batteriespeicher werden bei LEW Verteilnetz als steuerbare Verbrauchseinrichtungen angemeldet. Der Netzbetreiber darf sie im Netzengpassfall reduzieren, eine einzelne Anlage aber nie unter 4,2 Kilowatt. Dafür bekommen Sie reduzierte Netzentgelte. In einem Haus mit Steuerung ist der Eingriff im Regelfall nicht spürbar, weil die Anlage die Last ohnehin verschieben kann.',
  },
  {
    question: 'Lohnen sich zeitvariable Netzentgelte?',
    answer:
      'Nur, wenn im Haus etwas ist, das die Verschiebung tatsächlich ausführt. Modul 3 lässt sich zusätzlich zur pauschalen Reduzierung wählen und setzt ein intelligentes Messsystem voraus; der Netzbetreiber legt drei Preisstufen pro Tag fest. Ohne Automatik heißt das, Sie müssten Ihr Verhalten an einen Tarifkalender anpassen — das hält niemand durch. Mit einer Steuerung, die Ladefenster und Warmwasserbereitung in die Niedertarifzeit legt, wird daraus ein Vorteil ohne Aufmerksamkeit.',
  },
  {
    question: 'Kann ich Komponenten verschiedener Hersteller kombinieren?',
    answer:
      'Ja, aber es ist eine Entscheidung mit Folgen, keine Kleinigkeit. Ein System aus einer Hand ist einfacher in Betrieb zu nehmen und im Fehlerfall eindeutig zuständig. Eine offene Kombination ist flexibler und macht Sie unabhängiger von einem Anbieter, verlangt aber offene Schnittstellen — und dass jemand die Verantwortung für das Zusammenspiel übernimmt. Wir sagen Ihnen vorher, welchen der beiden Wege ein Vorschlag bedeutet.',
  },
  {
    question: 'Wie wirkt sich die Augsburger Wärmeplanung auf die Steuerung aus?',
    answer:
      'Sie bestimmt den Horizont. In Gebieten für dezentrale Versorgung bleibt die Wärme dauerhaft im Gebäude und damit meist elektrisch — die Steuerung muss auf Jahre den größten Verbraucher des Hauses mitregeln. In einem Wärmenetzgebiet kann sich dieser Verbraucher später verlagern, und ein System, das ausschließlich um die Wärmepumpe herum gebaut wurde, verliert einen Teil seiner Aufgabe. Wir legen deshalb auf offene Schnittstellen Wert, statt auf eine Lösung, die nur eine Konstellation kann.',
  },
];

export default function EnergiemanagementAugsburgPage() {
  return (
    <>
      <PageHero
        eyebrow="Region · Augsburg"
        headline={['Energiemanagement', 'in Augsburg.']}
        lede="Der regulatorische Rahmen liefert die Anreize: reduzierte Netzentgelte, zeitvariable Preisstufen, eine Drosselung im Engpassfall. Ob daraus ein Vorteil wird, entscheidet die Steuerung im Haus."
        image={IMAGES.energyManagement}
        trail={TRAIL}
        variant="inset"
      />

      <Prose eyebrow="Ausgangslage" title="Der Rahmen ist gesetzt. Genutzt wird er selten." align="left">
        <p>
          Seit § 14a des Energiewirtschaftsgesetzes in seiner heutigen Fassung gilt, sind Wärmepumpen,
          nicht öffentliche Wallboxen, Klimageräte und Batteriespeicher steuerbare
          Verbrauchseinrichtungen. Sie werden beim Netzbetreiber angemeldet — in Augsburg bei{' '}
          <Link href="/photovoltaik-augsburg/">LEW Verteilnetz</Link>, und dort nur über einen
          eingetragenen Elektrofachbetrieb — und dürfen im Netzengpassfall reduziert werden. Nie unter
          4,2 Kilowatt je Anlage.
        </p>
        <p>
          Im Gegenzug gelten reduzierte Netzentgelte. Wer zusätzlich ein intelligentes Messsystem hat,
          kann zeitvariable Netzentgelte wählen: drei vom Netzbetreiber festgelegte Preisstufen pro
          Tag, mit einem Vorteil für den, der Verbrauch in die günstige Stufe legt.
        </p>
        <p>
          <strong>Das ist ein sauber gebauter Anreiz — und er bleibt in den meisten Häusern
          ungenutzt.</strong> Nicht, weil die Technik fehlt, sondern weil niemand seinen Alltag nach
          einem Tarifkalender richtet. Ein Vorteil, der tägliche Aufmerksamkeit verlangt, wird nach
          drei Wochen nicht mehr wahrgenommen.
        </p>
        <p>
          Genau an dieser Stelle ist ein Energiemanagement kein Komfortprodukt, sondern die
          Voraussetzung dafür, dass die Regel überhaupt greift.
        </p>
      </Prose>

      <MediaBand
        image={IMAGES.energyManagement}
        width="full"
        caption="Ein Energiemanagement ist keine Anzeige. Es ist die Instanz, die entscheidet, wohin die nächste Kilowattstunde geht — jede Sekunde, ohne dass jemand hinsieht."
      />

      <Prose eyebrow="Die Aufgabe" title="Ein Zielkonflikt, der jeden Tag neu entsteht." align="right">
        <p>
          Solange nur Photovoltaik und Speicher im Haus sind, gibt es wenig zu entscheiden: Was nicht
          verbraucht wird, geht in den Speicher, was danach übrig ist, ins Netz. Mit dem zweiten
          großen Verbraucher ändert sich das grundlegend.
        </p>
        <p>
          Mittags stehen zwei Kilowatt Überschuss zur Verfügung. Das Fahrzeug soll geladen werden,
          die Wärmepumpe könnte Warmwasser machen, der Speicher ist halb voll und um vier Uhr zieht
          ein Wolkenfeld auf. Jede dieser Entscheidungen schließt die anderen aus.
        </p>
        <p>
          Ein Energiemanagement löst diesen Konflikt nicht durch Intelligenz, sondern durch eine
          <strong> festgelegte Reihenfolge</strong>. Die Reihenfolge ist der eigentliche Inhalt der
          Planung — und sie ist der Teil, den Sie verstehen und mitbestimmen sollten, weil sie Ihre
          Prioritäten abbildet und nicht unsere.
        </p>
      </Prose>

      <PriorityLadder />

      <Prose eyebrow="Netzentgelte" title="Modul 1 und Modul 3 — und was die Steuerung daraus macht." align="left">
        <p>
          <strong>Modul 1</strong> ist die pauschale Reduzierung des Netzentgelts. Sie gilt für die
          angemeldete steuerbare Verbrauchseinrichtung, unabhängig davon, wann Sie verbrauchen. Sie
          bekommen sie, ohne etwas zu ändern.
        </p>
        <p>
          <strong>Modul 3</strong> lässt sich zusätzlich wählen, wenn ein intelligentes Messsystem
          verbaut ist. Statt eines pauschalen Abschlags gibt es zeitvariable Netzentgelte: drei
          Preisstufen pro Tag, vom Netzbetreiber festgelegt. Wer den Verbrauch in die niedrige Stufe
          verschiebt, zahlt weniger.
        </p>
        <p>
          Der Unterschied zwischen beiden ist der Unterschied zwischen einem Rabatt und einem
          Werkzeug. Modul 3 belohnt Verhalten — und Verhalten lässt sich in einem Haushalt nur
          zuverlässig ändern, wenn es automatisiert ist.
        </p>
        <p>
          <strong>Praktisch heißt das:</strong> Die Steuerung kennt die Preisstufen, kennt die
          Erzeugungsprognose und kennt Ihre Randbedingungen — das Auto muss um sieben Uhr eine
          bestimmte Reichweite haben, das Warmwasser muss morgens auf Temperatur sein. Innerhalb
          dieser Grenzen sucht sie sich die günstigsten Fenster. Sie merken davon nichts außer der
          Abrechnung.
        </p>
        <p>
          Ob sich der Wechsel zu Modul 3 in Ihrem Fall rechnet, hängt daran, wie viel verschiebbare
          Last tatsächlich im Haus ist. Bei einer Wärmepumpe mit Pufferspeicher und einem Fahrzeug,
          das nachts steht, ist das viel. Bei einem Haushalt ohne beides ist es wenig, und dann
          bleibt Modul 1 die richtige Wahl. Wir rechnen das durch, statt es zu empfehlen.
        </p>
      </Prose>

      <Prose eyebrow="Horizont" title="Was die Wärmeplanung für die Steuerung bedeutet." align="right">
        <p>
          Die kommunale Wärmeplanung der Stadt Augsburg ordnet Teilgebiete Entwicklungspfaden zu und
          zielt auf eine weitgehend klimaneutrale Wärmeversorgung bis spätestens 2040. Für ein
          Energiemanagement ist das keine Randnotiz, sondern die Frage nach der Lebensdauer der
          Auslegung.
        </p>
        <p>
          Liegt Ihr Gebäude in einem Gebiet für{' '}
          <Link href="/waermepumpe-augsburg/">dezentrale Versorgung</Link>, bleibt die Wärmeerzeugung
          dauerhaft im Haus und damit in aller Regel elektrisch. Die Wärmepumpe ist auf Jahrzehnte
          der größte Verbraucher, und die Steuerung ist im Kern eine Wärmepumpensteuerung.
        </p>
        <p>
          Liegt es in einem Wärmenetzgebiet, kann sich dieser Verbraucher später verlagern. Ein
          System, das ausschließlich um die Wärmepumpe herum gebaut wurde, verliert dann einen Teil
          seiner Aufgabe — während Fahrzeug,{' '}
          <Link href="/stromspeicher-augsburg/">Speicher</Link> und Haushalt bleiben.
        </p>
        <p>
          Deshalb legen wir Wert auf offene Schnittstellen und auf eine Steuerung, die nicht an eine
          einzige Konstellation gebunden ist. Nicht aus Prinzip, sondern weil ein Gerät, das fünfzehn
          Jahre laufen soll, mehr als eine Konstellation erleben wird.
        </p>
      </Prose>

      <SourceList
        intro="Netzentgeltregeln und Planungsstände ändern sich schneller als eine Website. Jede Angabe hier steht mit der Stelle, die sie veröffentlicht."
        entries={SOURCES}
      />

      <Prose eyebrow="Umsetzung" title="Was wir liefern — und was Sie behalten." align="left" surface="light">
        <p>
          <strong>Die Regel.</strong> Eine schriftlich festgehaltene Priorisierung, die Sie
          nachvollziehen und ändern können. Kein Automatismus, den nur der Installateur versteht.
        </p>
        <p>
          <strong>Die Anmeldung.</strong> Steuerbare Verbrauchseinrichtungen bei LEW Verteilnetz,
          Modulwahl, Abstimmung mit dem Messstellenbetreiber, wenn ein intelligentes Messsystem
          nötig ist.
        </p>
        <p>
          <strong>Die Schnittstellen.</strong> Dokumentiert, offen und ohne Zwang zu einem
          Herstellerkonto. Sie sollen die Anlage auch dann noch erweitern können, wenn wir nicht mehr
          im Spiel sind.
        </p>
        <p>
          Wie die Komponenten im Gebäude zusammenspielen, zeigen wir am{' '}
          <Link href="/#system">Schnitt durch ein Haus</Link> auf der Startseite.
        </p>
      </Prose>

      <Faq entries={FAQ} />

      <PageCta
        headline="Bringen wir Ihre Reihenfolge zu Papier."
        body="Erzählen Sie uns, welche Verbraucher im Haus stehen und welche dazukommen sollen. Daraus entsteht die Priorisierung — und daraus erst die Frage, welches System sie ausführen kann."
      />
    </>
  );
}
