import { IMAGES, type ImageSlot } from '@/lib/assets';

export type Kategorie = {
  id: string;
  index: string;
  label: string;
  title: string;
  body: string;
  image?: ImageSlot;
};

/**
 * Die Kategorien beschreiben, was im Laden tatsächlich steht — belegt durch die
 * Fotos des Geschäfts und die Beschreibung, unter der es geführt wird
 * („Baby, Frühchen & Kinder Boutique — Umstandsmode — Neu & Secondhand“).
 * Keine Kategorie, für die es keinen Beleg gibt.
 *
 * Bewusst ohne Preise, Größenlisten oder Verfügbarkeiten: nichts davon lässt
 * sich hier aktuell halten, und eine Angabe, die im Laden nicht mehr stimmt,
 * ist schlechter als keine.
 */
export const KATEGORIEN: Kategorie[] = [
  {
    id: 'babymode',
    index: '01',
    label: 'Babymode',
    title: 'Für die ersten Monate.',
    body: 'Bodys, Strampler, Strickjacken und Mützen in den kleinen Größen — weiche Stoffe, die den Waschgang überstehen, und Schnitte, die sich über einen wackeligen Kopf ziehen lassen.',
    image: IMAGES.spieluhren,
  },
  {
    id: 'fruehchen',
    index: '02',
    label: 'Frühchen',
    title: 'Auch unterhalb von 50.',
    body: 'Frühchenkleidung ist kaum irgendwo im Regal zu finden. Hier schon — in den Größen unter der üblichen Neugeborenengröße, weil Eltern, die sie brauchen, sie sofort brauchen.',
  },
  {
    id: 'kindermode',
    index: '03',
    label: 'Kindermode',
    title: 'Vom Laufen bis zur Schule.',
    body: 'Hosen, Hemden, Kleider, Pullover und Jacken für Kita- und Grundschulalter. Zusammengestellt als Outfits, nicht als Stapel — im Laden lässt sich sehen, was zusammenpasst.',
    image: IMAGES.outfitMannequin,
  },
  {
    id: 'umstandsmode',
    index: '04',
    label: 'Umstandsmode',
    title: 'Und für die Schwangerschaft.',
    body: 'Kleidung für die Monate davor, im selben Laden wie die für danach. Wer zur Erstausstattung kommt, muss für sich selbst nicht noch woanders hin.',
  },
  {
    id: 'spielzeug',
    index: '05',
    label: 'Spielzeug & Holzspielzeug',
    title: 'Was liegen bleibt, wenn es still wird.',
    body: 'Kuscheltiere, Spieluhren, Holzspielzeug und Roller. Ausgesucht danach, ob es ein zweites und drittes Jahr übersteht — nicht danach, wie es in der Verpackung aussieht.',
    image: IMAGES.ladenRegal,
  },
  {
    id: 'geschenke',
    index: '06',
    label: 'Geschenke',
    title: 'Für den Besuch nach der Geburt.',
    body: 'Karten, Kleinigkeiten und zusammengestellte Geschenke zur Geburt oder zum Geburtstag. Auf Wunsch verpackt, solange Sie im Laden sind.',
    image: IMAGES.eingang,
  },
];
