import Link from 'next/link';
import { Faq } from '@/components/page/Faq';
import { MediaBand } from '@/components/page/MediaBand';
import { PageCta } from '@/components/page/PageCta';
import { PageHero } from '@/components/page/PageHero';
import { Prose } from '@/components/page/Prose';
import { IMAGES } from '@/lib/assets';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Carports und Terrassenüberdachungen mit Photovoltaik',
  description:
    'Überdachte Flächen lassen sich mit Modulen belegen, wenn Statik und Ausrichtung es hergeben. SolBauTec plant Carport und Terrassendach als Teil des Energiesystems — mit Wallbox von Anfang an.',
  path: '/carports-terrassenueberdachungen/',
});

const TRAIL = [
  { name: 'Start', path: '/' },
  { name: 'Lösungen', path: '/#loesungen' },
  { name: 'Carports und Terrassenüberdachungen', path: '/carports-terrassenueberdachungen/' },
];

const FAQ = [
  {
    question: 'Brauche ich eine Baugenehmigung?',
    answer:
      'Das richtet sich nach der Bayerischen Bauordnung, der Größe des Bauwerks, dem Abstand zur Grundstücksgrenze und dem geltenden Bebauungsplan. Manches ist verfahrensfrei, manches nicht. Wir klären das vor der Planung, nicht danach — und in Gebieten mit Gestaltungssatzung oder Denkmalschutz besonders sorgfältig.',
  },
  {
    question: 'Bleibt es unter einem Solar-Carport trocken?',
    answer:
      'Nur mit einer geeigneten Konstruktion. Module allein sind kein Dach: Zwischen ihnen bleiben Fugen. Wer Regendichtigkeit braucht, benötigt entweder eine Unterkonstruktion mit Rinnensystem oder Spezialmodule mit dichtenden Profilen. Das ist ein Preisunterschied und gehört vorher besprochen.',
  },
  {
    question: 'Lohnt sich das gegenüber Modulen auf dem Hausdach?',
    answer:
      'Pro Kilowatt-Peak ist ein Carport in der Regel teurer, weil die Tragkonstruktion mitbezahlt wird. Er lohnt sich, wenn das Hausdach nicht ausreicht, ungünstig ausgerichtet oder verschattet ist — oder wenn ohnehin ein Carport gebaut werden soll. Dann zahlen Sie die Konstruktion für den Stellplatz und bekommen die Fläche dazu.',
  },
  {
    question: 'Was ist der Unterschied zwischen einem Solar-Carport und einem Carport mit Modulen?',
    answer:
      'Beim Solar-Carport sind die Module das Dach — sie tragen und dichten, die Unterkonstruktion ist darauf ausgelegt. Beim Carport mit Modulen liegt ein vollständiges Dach darunter, die Module sitzen aufgeständert darauf. Die zweite Variante ist robuster und im Regelfall günstiger, die erste ist schlanker und wirkt ruhiger. Wer viel Wert auf die Optik legt, zahlt für die erste; wer vor allem eine trockene Fläche will, ist mit der zweiten besser bedient.',
  },
  {
    question: 'Kann ich einen vorhandenen Carport nachträglich belegen?',
    answer:
      'Manchmal. Entscheidend ist die Statik: Module plus Unterkonstruktion bringen zusätzliche Eigenlast, und im Winter kommt Schneelast dazu, die sich auf einer glatten Modulfläche anders verteilt als auf einem strukturierten Dach. Bei Holzkonstruktionen kommt der Zustand der Verbindungsmittel und der Auflager dazu. Wir sehen uns das Tragwerk an und sagen Ihnen, ob es trägt, ob es ertüchtigt werden kann oder ob ein Neubau der ehrlichere Weg ist.',
  },
  {
    question: 'Kann die Wallbox direkt daran?',
    answer:
      'Das ist der eigentliche Vorteil dieser Kombination: Erzeugung und Ladepunkt liegen am selben Ort. Wir planen die Zuleitung entsprechend dimensioniert, damit später auch eine leistungsfähigere Wallbox oder ein zweiter Ladepunkt möglich ist.',
  },
];

export default function CarportsPage() {
  return (
    <>
      <PageHero
        eyebrow="Lösung 06 · Gebäudelösungen"
        headline={['Überdachte Flächen', 'sind nutzbare', 'Flächen.']}
        lede="Ein Carport trägt ohnehin eine Konstruktion. Ob darauf Module liegen, entscheidet sich bei der Statik — und damit lange bevor gebaut wird."
        image={IMAGES.projectWide}
        trail={TRAIL}
        variant="split"
      />

      <Prose eyebrow="Die Ausgangslage" title="Wenn das Hausdach nicht reicht." align="left">
        <p>
          Nicht jedes Dach gibt her, was ein Haushalt braucht. Zu klein, ungünstig ausgerichtet,
          verschattet, denkmalgeschützt oder schlicht in einem Zustand, der eine Belegung für die
          nächsten zwanzig Jahre nicht trägt.
        </p>
        <p>
          In diesen Fällen sind Carport und Terrassenüberdachung die naheliegende zweite Fläche. Sie
          sind meist frei ausgerichtet, unverschattet und liegen dort, wo das Auto steht — also am
          selben Ort wie der größte flexible Verbraucher im Haushalt.
        </p>
      </Prose>

      <Prose eyebrow="Die Planung" title="Statik, Entwässerung, Zuleitung." align="right">
        <ul>
          <li>
            <strong>Tragwerk.</strong> Module, Unterkonstruktion, Schnee- und Windlasten. Eine
            Konstruktion, die für ein leichtes Dach ausgelegt wurde, trägt keine Modulfläche.
          </li>
          <li>
            <strong>Neigung und Ausrichtung.</strong> Flach gebaut ist optisch ruhiger, kostet aber
            Ertrag und führt zu stärkerer Verschmutzung, weil der Regen weniger abwäscht.
          </li>
          <li>
            <strong>Entwässerung.</strong> Der Punkt, an dem die meisten Solar-Carports scheitern.
            Module sind keine Dachhaut; wer Trockenheit erwartet, braucht ein Rinnensystem oder
            dichtende Profile.
          </li>
          <li>
            <strong>Zuleitung und Wallbox.</strong> Ausreichend dimensioniert für spätere
            Ladeleistungen, mit Leerrohr für einen zweiten Ladepunkt.
          </li>
          <li>
            <strong>Genehmigung.</strong> Bayerische Bauordnung, Abstandsflächen, Bebauungsplan und
            gegebenenfalls Gestaltungssatzung.
          </li>
        </ul>
      </Prose>

      <MediaBand
        image={IMAGES.finishedHouseEvening}
        width="full"
        caption="Eine Konstruktion, die ohnehin gebaut wird, trägt die Fläche gratis mit. Ob sie auch Module trägt, ist eine Frage des Tragwerks — und die wird vor dem ersten Fundament beantwortet."
      />

      <Prose eyebrow="Das Tragwerk" title="Schneelast ist der Grund, warum es teurer aussieht." align="left">
        <p>
          Der häufigste Einwand gegen einen Solar-Carport lautet, er sei überteuert. Der Grund dafür
          steckt nicht in den Modulen, sondern im Tragwerk — und er ist berechtigt.
        </p>
        <p>
          Ein Hausdach besitzt bereits eine Konstruktion, die Schnee und Wind aufnimmt; die
          Photovoltaikanlage legt sich mit vergleichsweise geringer Zusatzlast darauf. Ein Carport
          muss diese Konstruktion erst mitbringen. Dazu kommt, dass eine geschlossene, glatte
          Modulfläche Schnee anders hält als ein strukturiertes Dach: Er rutscht länger nicht ab und
          bleibt liegen, wo die Rechnung ihn nicht vorgesehen hatte.
        </p>
        <p>
          <strong>Was daraus folgt:</strong> Eine Solarüberdachung ist pro Kilowatt-Peak fast immer
          teurer als dieselbe Leistung auf einem vorhandenen Dach. Sie rechnet sich in zwei
          Situationen — wenn das Hausdach nicht ausreicht oder nicht belegbar ist, und wenn ohnehin
          ein Carport gebaut werden soll. Im zweiten Fall zahlen Sie das Tragwerk für den Stellplatz,
          und die Fläche kommt dazu.
        </p>
        <p>
          Wir sagen Ihnen, in welcher der beiden Situationen Sie sind, auch dann, wenn die Antwort
          gegen den Auftrag spricht.
        </p>
      </Prose>

      <Prose eyebrow="Genehmigung" title="Was in Bayern vor dem Bau zu klären ist." align="right">
        <p>
          Carports und Überdachungen bewegen sich in einem Bereich, in dem vieles verfahrensfrei ist
          und einiges eben nicht. Maßgeblich sind die Bayerische Bauordnung mit ihren Größen- und
          Abstandsregelungen, der geltende Bebauungsplan und, in Teilen von{' '}
          <Link href="/photovoltaik-augsburg/">Augsburg</Link>, eine Gestaltungssatzung oder der
          Ensembleschutz.
        </p>
        <ul>
          <li>
            <strong>Maße und Lage.</strong> Grundfläche, Wandhöhe und Länge an der
            Grundstücksgrenze entscheiden über die Verfahrensfreiheit.
          </li>
          <li>
            <strong>Bebauungsplan.</strong> Er kann Dachform, Neigung, Material und die überbaubare
            Fläche vorgeben — und damit indirekt auch, ob Module möglich sind.
          </li>
          <li>
            <strong>Gestaltungssatzung und Ensemble.</strong> In historischen Bereichen kann die
            Sichtbarkeit vom öffentlichen Raum den Ausschlag geben.
          </li>
          <li>
            <strong>Nachbarrecht.</strong> Entwässerung darf nicht auf das Nachbargrundstück
            geführt werden. Das klingt banal und ist der häufigste nachträgliche Streitpunkt.
          </li>
        </ul>
        <p>
          Verfahrensfrei heißt im Übrigen nicht regelfrei: Auch ein genehmigungsfreier Bau muss dem
          materiellen Baurecht entsprechen. Wir klären den Status vor der Planung ab, weil eine
          Konstruktion, die erst nach dem Aufstellen beanstandet wird, teuer zurückgebaut wird.
        </p>
      </Prose>

      <Prose eyebrow="Die Integration" title="Erzeugung und Ladepunkt am selben Ort." align="left" surface="light">
        <p>
          Ein Elektrofahrzeug ist der flexibelste große Verbraucher, den ein Haushalt hat. Es muss
          selten sofort voll sein, und es nimmt in einer Ladung mehr auf, als ein Hausspeicher fasst.
        </p>
        <p>
          Steht der Ladepunkt unter der Erzeugungsfläche, wird aus dieser Flexibilität ein direkter
          Vorteil: Das <Link href="/energiemanagement/">Energiemanagement</Link> kann das Fahrzeug
          genau dann laden, wenn Überschuss anliegt, ohne den Umweg über Speicher und Netz.
        </p>
        <p>
          Damit das funktioniert, muss die Wallbox in ihrer Leistung geregelt werden können — und
          zwar fein genug, um einem schwankenden Überschuss zu folgen. Eine Wallbox, die nur an oder
          aus kennt, zieht bei jeder Wolke Strom aus dem Netz oder bricht die Ladung ab. Das ist
          weniger eine Frage des Preises als der Auswahl.
        </p>
        <p>
          <strong>Zur Zuleitung:</strong> Wir legen sie für mehr aus, als am ersten Tag gebraucht
          wird, und ziehen ein Leerrohr für einen zweiten Ladepunkt mit ein. Der Graben ist beim Bau
          des Carports ohnehin offen; ihn Jahre später erneut zu öffnen, kostet ein Vielfaches der
          Mehrkosten für den größeren Querschnitt heute.
        </p>
        <p>
          Nicht öffentliche Ladeeinrichtungen zählen zu den steuerbaren Verbrauchseinrichtungen nach
          § 14a EnWG und werden beim Netzbetreiber angemeldet. Für Sie heißt das reduzierte
          Netzentgelte — und für die Planung, dass der Ladepunkt von Anfang an ins{' '}
          <Link href="/energiemanagement-augsburg/">Steuerungskonzept</Link> gehört und nicht als
          Nachtrag.
        </p>
      </Prose>

      <Faq entries={FAQ} />

      <PageCta
        headline="Sehen wir uns die Fläche an."
        body="Ob Neubau oder vorhandener Carport: Statik, Ausrichtung und Zuleitung entscheiden, was möglich ist. Das lässt sich vor Ort in kurzer Zeit klären."
      />
    </>
  );
}
