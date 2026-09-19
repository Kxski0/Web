import { IMAGES, type ImageSlot } from '@/lib/assets';
import { SIZES } from './facts';

export type GrowStep = {
  size: number;
  /** Lebensphase — beschreibend, keine medizinische Aussage. */
  phase: string;
  line: string;
  image: ImageSlot;
};

/**
 * Die Größenleiter, die der Laden abdeckt: 44 bis 122.
 *
 * Die Größen sind die üblichen deutschen Konfektionsgrößen für Kinder
 * (Körperlänge in Zentimetern). Sie sagen, welche Phase gemeint ist, und nicht,
 * was gerade auf Lager liegt.
 *
 * Nicht jede Größe bekommt eine eigene Zeile — vierzehn Texte hintereinander
 * liest niemand. Die Leiste zeigt alle vierzehn Werte, ausgeschrieben werden
 * die sechs Abschnitte, in denen sich tatsächlich etwas ändert.
 */
export const GROW_STEPS: GrowStep[] = [
  {
    size: 44,
    phase: 'Frühchen',
    line: 'Wenn es früher losgeht als geplant — die Größen unterhalb der Neugeborenengröße.',
    image: IMAGES.wareSpieluhren,
  },
  {
    size: 56,
    phase: 'Die ersten Wochen',
    line: 'Erstausstattung: Bodys, Strampler, Mützen. Was oft gewaschen wird, muss oft gewaschen werden können.',
    image: IMAGES.boutiqueRegalwand,
  },
  {
    size: 68,
    phase: 'Drehen und robben',
    line: 'Kleidung, die mitmacht, wenn sich alles bewegt. Dazu die ersten Kuscheltiere, die bleiben.',
    image: IMAGES.wareRegal,
  },
  {
    size: 86,
    phase: 'Laufen lernen',
    line: 'Schnitte, die ein Kind allein anbekommt, und Stoffe, die den Sandkasten überstehen.',
    image: IMAGES.wareTisch,
  },
  {
    size: 104,
    phase: 'Kita',
    line: 'Jacken, Hosen und Pullover für ein Alter, in dem Kleidung Arbeitskleidung ist.',
    image: IMAGES.outfitHerbst,
  },
  {
    size: 122,
    phase: 'Grundschule',
    line: 'Ab hier sucht das Kind mit aus. Der Laden ist klein genug, dass das in Ruhe geht.',
    image: IMAGES.outfitKind,
  },
];

export const GROW_LADDER = SIZES.ladder;
