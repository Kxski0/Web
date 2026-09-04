import Link from 'next/link';
import { Faq } from '@/components/page/Faq';
import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Prose } from '@/components/page/Prose';
import { DayCurve } from '@/components/page/DayCurve';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Stromspeicher — Auslegung nach Verbrauch, nicht nach Kapazität',
  description:
    'Ein Stromspeicher verschiebt den Ertrag des Mittags in den Abend. SolBauTec legt Speicher nach Ihrem Lastprofil aus und bindet sie in Photovoltaik, Wärmepumpe und Energiemanagement ein.',
  path: '/stromspeicher/',
  image: '/images/battery-storage-detail.webp',
});

const TRAIL = [
  { name: 'Start', path: '/' },
  { name: 'Lösungen', path: '/#loesungen' },
  { name: 'Stromspeicher', path: '/stromspeicher/' },
];

const FAQ = [
  {
    question: 'Wie groß sollte ein Speicher sein?',
    answer:
      'Groß genug, um den Abend und die Nacht zu tragen, und nicht größer. Ein Speicher, der im Sommer nie leer wird, hat Kapazität gekauft, die nie arbeitet. Die Auslegung folgt Ihrem Tagesverbrauch und der Größe der Photovoltaikanlage — nicht einer Faustformel pro Kilowatt-Peak.',
  },
  {
    question: 'Wie lange hält ein Speicher?',
    answer:
      'Hersteller geben üblicherweise eine Garantie über eine bestimmte Zahl von Vollzyklen oder eine Laufzeit in Jahren an, bis zu einer definierten Restkapazität. Entscheidend beim Vergleich ist, worauf sich die Garantie bezieht: verbleibende Kapazität, durchgesetzte Energiemenge oder schlicht die Jahre.',
  },
  {
    question: 'Kann ich einen Speicher nachrüsten?',
    answer:
      'Ja. Einfacher wird es, wenn die Photovoltaikanlage von Anfang an darauf ausgelegt wurde — mit einem speicherfähigen Wechselrichter oder wenigstens Platz und Leitungsweg im Technikraum. Nachrüsten heißt sonst oft, den Wechselrichter mitzutauschen.',
  },
  {
    question: 'Funktioniert der Speicher bei Stromausfall?',
    answer:
      'Nur, wenn er dafür ausgelegt ist. Ein normaler Speicher schaltet bei Netzausfall aus Sicherheitsgründen ab. Für Notstrom oder echte Ersatzstromfähigkeit braucht es eine entsprechende Gerätevariante und eine zusätzliche Umschalteinrichtung im Zählerschrank. Das ist eine Entscheidung, die vor der Installation fällt.',
  },
  {
    question: 'Wo steht der Speicher?',
    answer:
      'Frostfrei, trocken, temperiert und zugänglich — Technikraum, Hauswirtschaftsraum oder Keller. Er braucht Abstand zur Wand, eine geeignete Wand oder einen tragfähigen Boden und einen kurzen Weg zum Wechselrichter. Die Garage ist wegen der Temperaturen selten die beste Wahl.',
  },
  {
    question: 'Wie viel Energie geht im Speicher verloren?',
    answer:
      'Ein Teil jeder eingespeicherten Kilowattstunde kommt nicht wieder heraus. Verluste entstehen bei der Umwandlung, in der Zelle selbst und im Standby der Leistungselektronik, die rund um die Uhr mitläuft. Beim Vergleich zweier Geräte lohnt deshalb der Blick auf den Wirkungsgrad über den gesamten Pfad statt auf den Zellwirkungsgrad — und auf die Standby-Leistung, weil sie 8.760 Stunden im Jahr anliegt und bei kleinen Speichern einen überraschend großen Anteil ausmacht.',
  },
];

export default function StromspeicherPage() {
  return (
    <>
      <PageHero
        eyebrow="Lösung 02 · Stromspeicher"
        headline={['Energie, wenn', 'Sie sie brauchen.']}
        lede="Eine Photovoltaikanlage erzeugt mittags am meisten. Verbraucht wird am Morgen und am Abend. Der Speicher ist das Bauteil, das diese beiden Kurven zur Deckung bringt."
        image={IMAGES.batteryStorageDetail}
        trail={TRAIL}
        variant="split"
      />

      <Prose eyebrow="Das Problem" title="Erzeugung und Verbrauch treffen sich nicht." align="left">
        <p>
          Der Ertrag einer Photovoltaikanlage folgt der Sonne: eine Glocke mit dem Maximum um die
          Mittagszeit. Der Verbrauch eines Haushalts folgt dem Tagesablauf: morgens vor der Arbeit,
          abends nach der Arbeit, nachts fast nichts.
        </p>
        <p>
          Diese beiden Kurven überschneiden sich nur an den Rändern. Was mittags erzeugt und nicht
          gebraucht wird, geht ins Netz. Was abends gebraucht wird, kommt aus dem Netz zurück — zu
          einem Preis, der deutlich über der Einspeisevergütung liegt.
        </p>
        <p>
          Genau diese Differenz ist der wirtschaftliche Grund für einen Speicher. Nicht die
          Kapazität, sondern die Menge an Energie, die er über die Jahre vom Mittag in den Abend
          verschiebt.
        </p>
      </Prose>

      <DayCurve />

      <Prose eyebrow="Die Auslegung" title="Nach Lastprofil, nicht nach Faustformel." align="right">
        <p>
          Verbreitete Daumenregeln bemessen den Speicher nach der Anlagengröße. Das ist die falsche
          Bezugsgröße: Ein Speicher wird nicht von der Erzeugung geleert, sondern vom Verbrauch.
        </p>
        <ul>
          <li>
            <strong>Wie viel verbrauchen Sie zwischen Sonnenuntergang und Sonnenaufgang?</strong> Das
            ist die Menge, die der Speicher tragen soll.
          </li>
          <li>
            <strong>Kommt eine Wärmepumpe dazu?</strong> Sie verschiebt den Verbrauch deutlich in den
            Winter — in eine Zeit, in der der Speicher kaum geladen wird.
          </li>
          <li>
            <strong>Kommt ein Elektrofahrzeug dazu?</strong> Ein Auto zieht in einer Ladung mehr, als
            ein Hausspeicher fasst. Hier entscheidet die Steuerung mehr als die Kapazität.
          </li>
          <li>
            <strong>Wie groß ist die Anlage wirklich?</strong> Ein Speicher, der im Sommer nie voll
            wird, ist genauso falsch dimensioniert wie einer, der nie leer wird.
          </li>
        </ul>
      </Prose>

      <MediaBand
        image={IMAGES.batteryStorageDetail}
        width="narrow"
        caption="Speicher und Wechselrichter im Technikraum. Kurze Wege zwischen den Komponenten sparen Verluste und erleichtern spätere Wartung."
      />

      <Prose eyebrow="Die Integration" title="Der Speicher ist nicht der Schlusspunkt." align="left">
        <p>
          Ein Speicher ohne Steuerung lädt, sobald Überschuss da ist, und entlädt, sobald Bedarf da
          ist. Das ist ein vernünftiges Grundverhalten — aber es weiß nichts davon, dass morgen
          Sonne vorhergesagt ist, dass die Wärmepumpe gleich anläuft oder dass das Auto in vier
          Stunden voll sein muss.
        </p>
        <p>
          Diese Priorisierung übernimmt das Energiemanagement. Erst zusammen ergeben Speicher und
          Steuerung das, was den Eigenverbrauch tatsächlich hebt.
        </p>
        <p>
          Anmeldung, Steuerbarkeit und Nachrüstung im Augsburger Bestand behandeln wir gesondert
          auf der Seite zum
          <Link href="/stromspeicher-augsburg/">Stromspeicher in Augsburg</Link>.
        </p>
      </Prose>

      <Prose eyebrow="Die Alterung" title="Ein Speicher altert auch dann, wenn er nichts tut." align="left">
        <p>
          Batterien verlieren auf zwei voneinander unabhängigen Wegen Kapazität, und nur einer davon
          steht üblicherweise im Prospekt.
        </p>
        <p>
          <strong>Zyklische Alterung</strong> entsteht durch Nutzung: Jede Vollladung und Entladung
          kostet einen kleinen Teil der nutzbaren Kapazität. Das ist der Wert, den Garantien in
          Zyklen angeben, und der Grund, warum ein Speicher, der täglich einmal durchfährt, planbar
          altert.
        </p>
        <p>
          <strong>Kalendarische Alterung</strong> läuft unabhängig davon weiter. Sie hängt an
          Temperatur und am durchschnittlichen Ladezustand: Eine Zelle, die dauerhaft warm und
          dauerhaft voll steht, verliert schneller als eine kühl gelagerte im mittleren Bereich.
          Diese Alterung findet auch im leerstehenden Haus statt.
        </p>
        <p>
          Für die Auslegung folgt daraus etwas, das der Intuition widerspricht:{' '}
          <strong>Ein deutlich zu großer Speicher ist keine sichere Bank.</strong> Er fährt weniger
          Zyklen, altert kalendarisch aber genauso weiter — am Ende der Lebensdauer haben Sie für
          Kapazität bezahlt, die nie gearbeitet hat.
        </p>
        <p>
          Beim Vergleich von Garantien lohnt deshalb der Blick auf beide Bedingungen: die Zahl der
          zugesicherten Zyklen <em>und</em> die garantierte Restkapazität nach einer festen Zahl von
          Jahren. Ein Versprechen, das nur eines von beiden nennt, ist die Hälfte einer Aussage.
        </p>
        <p>
          Ebenso gehört der Aufstellort dazu. Ein unbeheizter, aber frostfreier Raum ist besser als
          ein warmer Technikraum neben der Heizung — und der Unterschied ist über fünfzehn Jahre
          größer als der zwischen zwei Fabrikaten.
        </p>
      </Prose>

      <Faq entries={FAQ} />

      <PageCta
        headline="Rechnen wir es an Ihrem Verbrauch durch."
        body="Mit Ihrer Jahresabrechnung und, falls vorhanden, den Ertragsdaten Ihrer Anlage lässt sich ziemlich genau sagen, welche Speichergröße bei Ihnen arbeitet — und ab wann zusätzliche Kapazität nur noch Anschaffungskosten sind."
      />
    </>
  );
}
