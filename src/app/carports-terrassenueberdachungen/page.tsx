import { Faq } from '@/components/page/Faq';
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

      <Prose eyebrow="Die Integration" title="Erzeugung und Ladepunkt am selben Ort." align="left" surface="light">
        <p>
          Ein Elektrofahrzeug ist der flexibelste große Verbraucher, den ein Haushalt hat. Es muss
          selten sofort voll sein, und es nimmt in einer Ladung mehr auf, als ein Hausspeicher fasst.
        </p>
        <p>
          Steht der Ladepunkt unter der Erzeugungsfläche, wird aus dieser Flexibilität ein direkter
          Vorteil: Das Energiemanagement kann das Fahrzeug genau dann laden, wenn Überschuss anliegt,
          ohne den Umweg über Speicher und Netz.
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
