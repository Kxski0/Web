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
  title: 'Photovoltaik Augsburg — Netzanmeldung, Altstadt, Dachcheck',
  description:
    'Photovoltaik in Augsburg: LEW Verteilnetz als zuständiger Netzbetreiber, Anmeldung über den Elektrofachbetrieb, Denkmal- und Ensembleschutz in der Altstadt. Was hier wirklich lokal ist — und was nicht.',
  path: '/photovoltaik-augsburg/',
  image: '/images/roof-architecture.webp',
});

const TRAIL = [
  { name: 'Start', path: '/' },
  { name: 'Photovoltaik', path: '/photovoltaik/' },
  { name: 'Augsburg', path: '/photovoltaik-augsburg/' },
];

const SOURCES = [
  {
    claim:
      'LEW Verteilnetz ist der Verteilnetzbetreiber für Augsburg und weite Teile Bayerisch-Schwabens. Die Anmeldung einer Erzeugungsanlage läuft über das Auftragsportal und ist nur eingetragenen Elektrofachbetrieben möglich.',
    source: 'LEW Verteilnetz GmbH',
    href: 'https://www.lew-verteilnetz.de/',
  },
  {
    claim:
      'Für Anlagen bis 30 Kilowatt nennt LVN eine Bearbeitung des Netzanschlussbegehrens innerhalb von 14 Werktagen, für größere Anlagen bis zu acht Wochen.',
    source: 'LEW Verteilnetz, Angaben zum Anschlussprozess',
    href: 'https://www.lew-verteilnetz.de/',
  },
  {
    claim:
      'Das Bayerische Denkmalschutzgesetz wurde im Juli 2023 geändert. Dient eine Solaranlage überwiegend der Eigenversorgung, darf die Erlaubnis am Baudenkmal nur versagt werden, wenn gewichtige Gründe des Denkmalschutzes entgegenstehen.',
    source: 'Bayerisches Denkmalschutzgesetz (BayDSchG)',
    href: 'https://www.gesetze-bayern.de/Content/Document/BayDSchG',
  },
  {
    claim:
      'Die Stadt Augsburg arbeitet an einem Solar-Rahmenplan für die Altstadt. Als Modellquartiere werden die Jakobervorstadt und das Ulrichsviertel untersucht; die Ergebnisse sollen anschließend auf das übrige Altstadtgebiet übertragen werden.',
    source: 'Die Augsburger Zeitung, Bericht zum Solar-Rahmenplan',
    href: 'https://www.daz-augsburg.de/augsburg-plant-solar-rahmenplan-fuer-die-altstadt/',
  },
  {
    claim:
      'Steckersolargeräte bis 2.000 Watt Modulleistung und 800 Watt Wechselrichterleistung brauchen keine gesonderte Anmeldung beim Netzbetreiber, müssen aber im Marktstammdatenregister eingetragen werden.',
    source: 'Bundesnetzagentur, Marktstammdatenregister',
    href: 'https://www.marktstammdatenregister.de/MaStR',
  },
];

const FAQ = [
  {
    question: 'Wer ist in Augsburg für meinen Netzanschluss zuständig?',
    answer:
      'LEW Verteilnetz. Das überrascht viele, weil die Stadtwerke Augsburg als Energieversorger sichtbarer sind — der Strom, den Sie kaufen, und das Netz, an dem Sie hängen, sind aber zwei verschiedene Dinge. Für die Anmeldung Ihrer Photovoltaikanlage, für die Inbetriebsetzung und für alles, was am Zählerschrank passiert, ist LVN Ihr Gegenüber. Die Anmeldung selbst können Sie nicht abgeben: Sie ist eingetragenen Elektrofachbetrieben vorbehalten. Wir übernehmen sie.',
  },
  {
    question: 'Wie lange dauert die Anmeldung?',
    answer:
      'LVN nennt für Anlagen bis 30 Kilowatt eine Bearbeitung innerhalb von 14 Werktagen, für größere Anlagen bis zu acht Wochen. Das ist die Bearbeitungszeit für das Netzanschlussbegehren, nicht die Gesamtdauer bis zur Inbetriebnahme — davor liegen Planung, Materialbeschaffung und Montage, danach die Inbetriebsetzung und der Zählerwechsel. Wir planen die Anmeldung deshalb früh ein und nicht erst, wenn das Gerüst schon steht.',
  },
  {
    question: 'Meine Immobilie steht in der Altstadt. Ist Photovoltaik damit erledigt?',
    answer:
      'Nein, aber es wird ein Genehmigungsthema statt eines reinen Montagethemas. Seit der Änderung des Bayerischen Denkmalschutzgesetzes 2023 ist die Ausgangslage für Anlagen, die überwiegend der Eigenversorgung dienen, deutlich besser: Die Erlaubnis darf nur versagt werden, wenn gewichtige Gründe des Denkmalschutzes entgegenstehen. Zuständig ist die Untere Denkmalschutzbehörde der Stadt. Wichtig ist, mit der Behörde zu sprechen, bevor eine Belegung geplant ist — nicht danach.',
  },
  {
    question: 'Wie viel Ertrag bringt eine Anlage in Augsburg?',
    answer:
      'Wir nennen dafür bewusst keine Faustzahl. Die öffentlich kursierenden Einstrahlungswerte für den Raum Augsburg gehen auseinander, und selbst der beste regionale Mittelwert sagt nichts über ein konkretes Dach: Neigung, Ausrichtung, Verschattung, Modultemperatur und Verschaltung verschieben das Ergebnis stärker als der Unterschied zwischen zwei Landkreisen. Sie bekommen von uns eine Ertragsrechnung für Ihre Fläche, nicht für Ihre Postleitzahl.',
  },
  {
    question: 'Lohnt sich erst einmal ein Balkonkraftwerk?',
    answer:
      'Als Einstieg ja, als Ersatz nein. Steckersolargeräte bis 2.000 Watt Modul- und 800 Watt Wechselrichterleistung brauchen keine gesonderte Netzbetreiber-Anmeldung, nur den Eintrag im Marktstammdatenregister. Sie decken die Grundlast und machen Verbrauch sichtbar. Eine Dachanlage bewegt sich in einer anderen Größenordnung und ist die Voraussetzung dafür, dass Speicher und Wärmepumpe überhaupt sinnvoll dazukommen können.',
  },
];

export default function PhotovoltaikAugsburgPage() {
  return (
    <>
      <PageHero
        eyebrow="Region · Augsburg"
        headline={['Photovoltaik', 'in Augsburg.']}
        lede="Die Physik einer Solaranlage ist überall dieselbe. Lokal sind der Netzbetreiber, der Anmeldeweg und die Frage, ob Ihr Dach im Ensemble liegt. Genau darum geht es auf dieser Seite."
        image={IMAGES.roofArchitecture}
        trail={TRAIL}
        variant="inset"
      />

      <Prose eyebrow="Vorab" title="Was an einer Anlage regional ist — und was nicht." align="left">
        <p>
          Regionale Seiten neigen dazu, denselben Text mit ausgetauschtem Ortsnamen zu erzählen. Das
          ist für Sie wertlos, und es stimmt auch nicht: Ein Modul liefert in Augsburg nicht anders
          als in Ulm, ein Wechselrichter altert nicht schwäbisch.
        </p>
        <p>
          Was hier tatsächlich anders ist, sind drei Dinge — der Netzbetreiber und sein Anmeldeweg,
          die denkmalrechtliche Lage in einer Stadt mit einem der größten historischen Ensembles
          Bayerns, und die kommunale Wärmeplanung, die entscheidet, worauf Ihr Gebäude langfristig
          zusteuert.
        </p>
        <p>
          Die Technik selbst erklären wir dort, wo sie hingehört:{' '}
          <Link href="/photovoltaik/">auf der Seite zur Photovoltaik</Link>. Hier steht das
          Augsburger Drumherum.
        </p>
      </Prose>

      <Prose eyebrow="Netzanschluss" title="Ihr Netzbetreiber heißt LEW Verteilnetz." align="right">
        <p>
          Nicht die Stadtwerke Augsburg. Das ist die häufigste Verwechslung in unseren
          Erstgesprächen, und sie hat einen nachvollziehbaren Grund: Der Versorger, von dem Sie
          Strom kaufen, ist im Alltag sichtbar; der Netzbetreiber, an dessen Leitungen Sie hängen,
          ist es nicht. Für alles, was mit Einspeisung zu tun hat, zählt der zweite.
        </p>
        <p>
          <strong>Praktisch heißt das:</strong> Das Netzanschlussbegehren, die Inbetriebsetzung und
          die Zählersetzung laufen über das Auftragsportal von LEW Verteilnetz — und dort nur über
          einen bei LVN eingetragenen Elektrofachbetrieb. Als Anlagenbetreiber können Sie das nicht
          selbst einreichen. Das ist kein bürokratisches Ärgernis, sondern die Stelle, an der die
          Verantwortung für die Elektroinstallation zugeordnet wird.
        </p>
        <p>
          <strong>Zur Dauer:</strong> LVN nennt für Anlagen bis 30 Kilowatt eine Bearbeitung
          innerhalb von 14 Werktagen; darüber bis zu acht Wochen. Wir stellen die Anmeldung deshalb,
          sobald die Auslegung steht, und nicht erst kurz vor der Montage — sonst wird aus einer
          Formalie der Grund, warum eine fertige Anlage drei Wochen stillsteht.
        </p>
        <p>
          Der Eintrag ins Marktstammdatenregister der Bundesnetzagentur kommt zusätzlich dazu.
          Beides übernehmen wir und geben Ihnen die Bestätigungen zur Anlagendokumentation dazu.
        </p>
      </Prose>

      <MediaBand
        image={IMAGES.pvInstallationRooftop}
        width="full"
        caption="Ein Ziegeldach im Bestand. Was auf dem Papier eine Belegung ist, ist hier eine Frage von Sparrenlage, Dachhakenposition und Leitungsweg zum Zählerschrank."
      />

      <Prose eyebrow="Denkmal und Ensemble" title="Die Altstadt schließt Photovoltaik nicht mehr aus." align="left">
        <p>
          Augsburg hat einen historischen Kern, der in weiten Teilen unter Ensembleschutz steht,
          dazu eine hohe Dichte an Einzeldenkmälern. Lange galt eine Photovoltaikanlage dort als
          faktisch aussichtslos. Diese Einschätzung ist überholt.
        </p>
        <p>
          Das Bayerische Denkmalschutzgesetz wurde im Juli 2023 geändert. Für Solaranlagen, die
          <strong> überwiegend der Eigenversorgung dienen</strong>, hat sich die Abwägung
          verschoben: Die denkmalrechtliche Erlaubnis darf nur noch versagt werden, wenn gewichtige
          Gründe des Denkmalschutzes entgegenstehen. Die Beweislast liegt damit nicht mehr bei
          Ihnen, sondern in der Begründung der Behörde.
        </p>
        <p>
          Parallel arbeitet die Stadt Augsburg an einem Solar-Rahmenplan für die Altstadt. Als
          Modellquartiere werden die Jakobervorstadt und das Ulrichsviertel untersucht; die
          Ergebnisse sollen später auf das gesamte Altstadtgebiet übertragen werden. Das Ziel ist,
          aus Einzelfallentscheidungen ein nachvollziehbares Raster zu machen.
        </p>
        <p>
          <strong>Was das für Ihr Vorhaben bedeutet:</strong> Der Weg führt über die Untere
          Denkmalschutzbehörde der Stadt, und er führt dorthin <em>vor</em> der Detailplanung. Ob
          eine Belegung genehmigungsfähig ist, hängt an Sichtbarkeit von der Straße, an der Wirkung
          in der Dachlandschaft und an der Ausführung — mattschwarze Module in geschlossener,
          rechteckiger Fläche, bündig, ohne überstehende Ränder, sind ein anderer Antrag als eine
          über die Fläche verteilte Belegung mit glänzenden Rahmen.
        </p>
        <p>
          Weil der Rahmenplan noch entsteht, ist der aktuelle Stand bei der Behörde zu erfragen. Wir
          klären das im Rahmen der Planung ab, statt Ihnen ein Ergebnis zu versprechen, das nicht in
          unserer Hand liegt.
        </p>
      </Prose>

      <Prose eyebrow="Ertrag" title="Warum hier keine Kilowattstunden-Faustzahl steht." align="right">
        <p>
          Auf vielen regionalen Solarseiten steht ein Einstrahlungswert für den jeweiligen Ort,
          meist auf die Kilowattstunde genau. Wir verzichten darauf, und zwar aus einem konkreten
          Grund: Die öffentlich zugänglichen Angaben für den Raum Augsburg gehen auseinander, je
          nachdem, welcher Datensatz, welcher Zeitraum und welche Bezugsfläche zugrunde liegen.
        </p>
        <p>
          Eine Zahl, die wir nicht belegen können, schreiben wir nicht hin — auch dann nicht, wenn
          sie plausibel klingt und die Seite dadurch konkreter wirken würde.
        </p>
        <p>
          Der Punkt ist ohnehin ein anderer: Selbst ein präziser regionaler Mittelwert erklärt nur
          einen kleinen Teil dessen, was Ihre Anlage liefert. Neigung, Ausrichtung, Verschattung
          über den Jahresverlauf, Modultemperatur im Sommer, Stringverschaltung und der
          Teillastwirkungsgrad des Wechselrichters verschieben das Ergebnis erheblich weiter als der
          Unterschied zwischen zwei benachbarten Landkreisen.
        </p>
        <p>
          Deshalb rechnen wir mit Ihrem Dach. Sie bekommen eine Ertragsprognose mit den Annahmen,
          auf denen sie steht — und mit dem Hinweis, welche davon wir gemessen und welche wir
          angenommen haben.
        </p>
      </Prose>

      <SourceList
        intro="Die regionalen Angaben auf dieser Seite lassen sich nachlesen. Regeln und Planungsstände ändern sich; prüfen Sie im Zweifel die Quelle."
        entries={SOURCES}
      />

      <Prose eyebrow="Ablauf" title="Wie ein Augsburger Projekt bei uns läuft." align="left" surface="light">
        <p>
          <strong>Erstgespräch und Dachcheck.</strong> Wir sehen uns das Dach an, den Zählerschrank,
          die Leitungswege und Ihren Verbrauch der letzten zwölf Monate. Bei Gebäuden im Ensemble
          oder mit Denkmaleigenschaft steht am Anfang zusätzlich die Frage, was genehmigungsfähig
          ist.
        </p>
        <p>
          <strong>Auslegung.</strong> Belegung, Verschattungsanalyse, Wechselrichter,
          Speicherreserve, Zählerkonzept. Wenn eine{' '}
          <Link href="/waermepumpe-augsburg/">Wärmepumpe</Link> oder eine Wallbox absehbar ist,
          gehört sie hier schon in die Planung, nicht in eine spätere Nachrüstung.
        </p>
        <p>
          <strong>Anmeldung.</strong> Netzanschlussbegehren bei LEW Verteilnetz,
          Marktstammdatenregister, bei Bedarf denkmalrechtliche Erlaubnis.
        </p>
        <p>
          <strong>Montage und Inbetriebnahme.</strong> Gerüst, Unterkonstruktion, Module,
          Gleichstromseite, Wechselrichter, Zählerschrank. Die Elektroinstallation machen wir
          selbst. Zum Schluss Inbetriebsetzung mit LVN, Prüfprotokoll, Strangpläne und Übergabe.
        </p>
      </Prose>

      <Faq entries={FAQ} />

      <PageCta
        headline="Schicken Sie uns Ihr Dach."
        body="Ein paar Fotos, die Adresse und Ihre letzte Stromabrechnung reichen für eine erste belastbare Einschätzung — inklusive der Frage, ob bei Ihrem Gebäude ein denkmalrechtlicher Schritt dazugehört."
      />
    </>
  );
}
