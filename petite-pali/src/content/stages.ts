export type Stage = {
  id: string;
  /** Kurzform für die Leiste. */
  label: string;
  /** Größenangabe, wie sie im Etikett steht. */
  size: string;
  title: string;
  body: string;
};

/**
 * Die Lebensphasen, die der Laden abdeckt — der rote Faden der Startseite.
 *
 * Die Größenangaben sind die üblichen deutschen Konfektionsgrößen für Kinder
 * (Körperlänge in Zentimetern) und keine Angabe über den Lagerbestand: sie
 * sagen, welche Phase gemeint ist, nicht welches Teil gerade da ist.
 */
export const STAGES: Stage[] = [
  {
    id: 'fruehchen',
    label: 'Frühchen',
    size: 'bis Größe 50',
    title: 'Wenn es früher losgeht als geplant.',
    body: 'Für Frühgeborene gibt es die Größen unterhalb der Neugeborenengröße — dort, wo die meisten Sortimente erst anfangen. Wer sie braucht, hat selten Zeit zu suchen.',
  },
  {
    id: 'neugeboren',
    label: 'Neugeboren',
    size: 'Größe 50–62',
    title: 'Die ersten Wochen.',
    body: 'Erstausstattung: Bodys, Strampler, Mützen, Decken. Alles, was oft gewaschen wird, muss oft gewaschen werden können — danach ist es ausgesucht.',
  },
  {
    id: 'baby',
    label: 'Baby',
    size: 'Größe 68–86',
    title: 'Drehen, robben, sitzen.',
    body: 'Kleidung, die mitmacht, wenn sich alles bewegt. Dazu Spieluhren und die ersten Kuscheltiere, die bleiben.',
  },
  {
    id: 'kleinkind',
    label: 'Kleinkind',
    size: 'Größe 92–104',
    title: 'Selber anziehen.',
    body: 'Schnitte, die ein Kind allein schafft — und Stoffe, die den Sandkasten überstehen. In dieser Phase kommen die Roller dazu.',
  },
  {
    id: 'kita',
    label: 'Kita',
    size: 'Größe 110–122',
    title: 'Jeden Tag draußen.',
    body: 'Jacken, Hosen und Pullover für ein Alter, in dem Kleidung Arbeitskleidung ist. Hier lohnt sich Secondhand am meisten.',
  },
  {
    id: 'schulkind',
    label: 'Schulkind',
    size: 'ab Größe 128',
    title: 'Eigener Geschmack.',
    body: 'Ab hier sucht das Kind mit aus. Der Laden ist klein genug, dass das geht, ohne dass jemand die Geduld verliert.',
  },
];
