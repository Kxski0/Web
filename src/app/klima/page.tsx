import Link from 'next/link';
import { Faq } from '@/components/page/Faq';
import { MediaBand } from '@/components/page/MediaBand';
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
    question: 'Was ist der Unterschied zwischen stiller und aktiver Kühlung?',
    answer:
      'Stille Kühlung — oft „passive Kühlung“ genannt — nutzt die Temperatur der Wärmequelle direkt. Bei einer Erdwärmepumpe heißt das: Sole aus dem Erdreich läuft über einen Wärmetauscher in die Flächen, der Verdichter bleibt aus. Das kostet fast keinen Strom, liefert aber nur eine begrenzte Leistung. Aktive Kühlung kehrt den Kältekreis um; der Verdichter läuft, die Leistung ist deutlich höher, der Stromverbrauch ebenfalls. Luft-Wasser-Wärmepumpen können in der Regel nur aktiv kühlen.',
  },
  {
    question: 'Wie laut ist ein Klimagerät für den Nachbarn?',
    answer:
      'Das Außengerät einer Split-Anlage unterliegt denselben Anforderungen wie die Außeneinheit einer Wärmepumpe: § 22 BImSchG und TA Lärm, mit den strengen Nachtwerten als maßgeblicher Grenze. Kühlung läuft zwar überwiegend tagsüber, in Hitzeperioden aber auch nachts durch. Der Standort gehört deshalb gerechnet und nicht danach ausgewählt, wo gerade Platz ist.',
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

      <MediaBand
        image={IMAGES.heatPumpArchitecture}
        width="inset"
        caption="Dieselbe Maschine, andere Betriebsrichtung. Ob sie im Sommer kühlen kann, entscheidet sich bei der Auswahl — nicht später am Regler."
      />

      <Prose eyebrow="Die Grenze" title="Der Taupunkt ist die eigentliche Beschränkung." align="left">
        <p>
          Eine gekühlte Fläche kann nicht beliebig kalt werden. Unterschreitet ihre Oberfläche den
          Taupunkt der Raumluft, schlägt sich Feuchtigkeit nieder — auf einem Estrich mit Parkett
          darüber ist das kein Schönheitsfehler, sondern ein Bauschaden.
        </p>
        <p>
          Der Taupunkt hängt an Temperatur und Feuchte der Raumluft und liegt an einem schwülen
          Julitag deutlich höher als an einem trockenen. Deshalb gehört zu jeder Flächenkühlung eine
          <strong> Taupunktüberwachung</strong>: Sensoren messen Raumtemperatur und relative Feuchte,
          die Regelung hebt die Vorlauftemperatur an, sobald es eng wird. Fehlt diese Überwachung,
          bleibt nur, sehr vorsichtig zu fahren — und damit einen Teil der möglichen Leistung
          liegenzulassen.
        </p>
        <p>
          <strong>Was daraus praktisch folgt:</strong> Flächenkühlung nimmt Spitzen, sie macht kein
          Kühlhaus. Zwei bis drei Grad unter der Temperatur, die sich sonst einstellen würde, sind
          ein realistischer Anspruch. Wer fünfzehn Grad im Wohnzimmer erwartet, ist bei der falschen
          Technik.
        </p>
      </Prose>

      <Prose eyebrow="Die Luft" title="Lüftung ist die Hälfte, an die niemand denkt." align="right">
        <p>
          Eine Lüftungsanlage mit Wärmerückgewinnung ist im Winter dafür gebaut, die Wärme in der
          Abluft zurückzuholen. Im Sommer wäre genau das falsch — sie würde die Wärme der warmen
          Außenluft in das kühle Haus hineinreichen.
        </p>
        <p>
          Deshalb hat jede brauchbare Anlage einen <strong>Sommerbypass</strong>, der den
          Wärmetauscher umgeht, sobald es draußen nachts kühler ist als drinnen. In den Stunden
          zwischen zwei und sechs Uhr lässt sich damit ein massives Gebäude spürbar entladen — ohne
          offene Fenster, ohne Insekten, ohne Einbruchsrisiko und mit einem Bruchteil des Stroms, den
          eine Kältemaschine für dieselbe Wärmemenge bräuchte.
        </p>
        <p>
          Die Kehrseite: Der Bypass muss richtig parametriert sein. Anlagen, die ihn nie öffnen, weil
          eine Freigabetemperatur falsch gesetzt ist, sind in der Praxis häufig. Das ist ein
          Einstellungsthema, kein Gerätethema — und es ist einer der wenigen Punkte, an denen
          Nachrüsten nichts kostet außer einer halben Stunde an der Regelung.
        </p>
      </Prose>

      <Prose eyebrow="Die Ausnahme" title="Wo ein Split-Gerät die richtige Antwort ist." align="left">
        <p>
          Es gibt Räume, in denen Flächenkühlung und Nachtlüftung nicht ausreichen: das
          ausgebaute Dachgeschoss mit leichter Konstruktion und geringer Speichermasse, das Zimmer
          mit großer, nicht verschattbarer Südverglasung, der Raum mit hoher innerer Last.
        </p>
        <p>
          Dort ist ein Split-Gerät die ehrliche Lösung — aber gezielt für diesen Raum, nicht als
          Gebäudekonzept. Drei Punkte entscheiden über die Qualität der Ausführung:
        </p>
        <ul>
          <li>
            <strong>Das Kältemittel.</strong> Geräte unterscheiden sich erheblich im
            Treibhauspotenzial ihres Kältemittels. Das ist keine Nebensache, sondern eine
            Entscheidung mit Folgen über die gesamte Lebensdauer und für die Entsorgung.
          </li>
          <li>
            <strong>Der Schall des Außengeräts.</strong> Es gelten dieselben Anforderungen wie bei
            einer <Link href="/waermepumpe-augsburg/">Wärmepumpen-Außeneinheit</Link>: § 22 BImSchG
            und TA Lärm, mit dem Nachtwert am nächsten schutzbedürftigen Fenster als Maßstab.
          </li>
          <li>
            <strong>Die Position des Innengeräts.</strong> Ein Gerät, dessen Luftstrom auf einen
            Sitzplatz oder ein Bett zielt, wird abgeschaltet, egal wie effizient es ist. Zugfreiheit
            ist eine Planungsfrage, keine Frage der Gerätequalität.
          </li>
        </ul>
      </Prose>

      <Prose eyebrow="Die Integration" title="Der Verbraucher, der am besten zur Sonne passt." align="left" surface="light">
        <p>
          Kühlung ist unter allen Verbrauchern im Haus derjenige mit der besten zeitlichen
          Übereinstimmung zum Solarertrag. Der Bedarf steigt mit der Einstrahlung — genau dann, wenn
          die Photovoltaikanlage am meisten liefert.
        </p>
        <p>
          Damit ist Kühlung, anders als das Heizen im Januar, ein Fall, in dem eigener Strom den
          Verbrauch tatsächlich weitgehend decken kann. Vorausgesetzt, das{' '}
          <Link href="/energiemanagement/">Energiemanagement</Link> kennt die Kühlung als steuerbaren
          Verbraucher.
        </p>
        <p>
          Es geht dabei um mehr als um ein Freigabesignal. Ein Gebäude mit Speichermasse lässt sich
          <strong> vorkühlen</strong>: Wenn mittags Überschuss anfällt, wird die Fläche etwas tiefer
          gefahren als nötig, und der Raum zehrt am Abend davon. Das ist thermische Speicherung ohne
          Batterie — dieselbe Idee, mit der eine Wärmepumpe im Winter Warmwasser in die Mittagsstunden
          legt, nur mit umgekehrtem Vorzeichen.
        </p>
        <p>
          Nach § 14a EnWG zählen Klimageräte übrigens zu den steuerbaren Verbrauchseinrichtungen.
          Wer sie anmeldet, bekommt reduzierte Netzentgelte — und wer sie zusätzlich steuern lässt,
          merkt von der möglichen Reduzierung im Regelfall nichts, weil ein vorgekühltes Gebäude eine
          Stunde ohne Nachschub überbrückt.
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
