import { IMAGES, type ImageSlot } from '@/lib/assets';

export type Kategorie = {
  id: string;
  label: string;
  /** Die Zeile unter dem Namen — knapp, konkret, keine Werbezeile. */
  note: string;
  title: string;
  body: string;
  href: string;
  image: ImageSlot;
};

/**
 * Die sechs Bereiche des bestehenden Auftritts. Die Inhalte stammen von dort,
 * die Reihenfolge ist eine Gestaltungsentscheidung: sie greift in die
 * Spaltenbreiten des Rasters (4+2, 2+4, 3+3), damit die breiten Felder auch
 * die Bereiche mit dem stärksten Bild tragen.
 */
export const KATEGORIEN: Kategorie[] = [
  {
    id: 'fruehchen',
    label: 'Frühchen',
    note: 'Ab Größe 44',
    title: 'Kleidung, die von Anfang an passt.',
    body: 'Frühchenkleidung beginnt dort, wo die meisten Sortimente erst anfangen. Wer sie braucht, braucht sie sofort — deshalb liegt sie hier im Laden und nicht in einem Katalog.',
    href: '/sortiment/fruehchen/',
    image: IMAGES.wareSpieluhren,
  },
  {
    id: 'baby-und-kind',
    label: 'Baby & Kind',
    note: 'Bis Größe 122',
    title: 'Vom ersten Body bis zur Grundschule.',
    body: 'Bodys, Strampler, Hosen, Kleider, Strickjacken. Zusammengestellt als Outfits statt als Stapel — im Laden lässt sich sehen, was zusammenpasst.',
    href: '/sortiment/baby-und-kind/',
    image: IMAGES.outfitKind,
  },
  {
    id: 'fuer-mama',
    label: 'Für Mama',
    note: 'Schwangerschaft & Stillzeit',
    title: 'Schwanger. Schön. Du.',
    body: 'Umstands- und Stillmode im selben Laden wie die Erstausstattung. Wer für das Kind kommt, muss für sich selbst nicht noch woanders hin.',
    href: '/sortiment/fuer-mama/',
    image: IMAGES.boutiqueRegalwand,
  },
  {
    id: 'tragehilfen',
    label: 'Tragehilfen',
    note: 'Persönlich ausprobieren',
    title: 'Welche Trage passt zu euch?',
    body: 'Tragehilfen lassen sich nicht aus einer Produktbeschreibung auswählen. Hier werden sie angelegt, eingestellt und ausprobiert — mit Beratung.',
    href: '/sortiment/tragehilfen/',
    image: IMAGES.boutiqueBeratung,
  },
  {
    id: 'kinderwagen',
    label: 'Kinderwagen',
    note: 'Vor Ort entdecken',
    title: 'Nicht nur anschauen. Ausprobieren.',
    body: 'Schieben, falten, hochheben, in den Kofferraum stellen. Erst dabei zeigt sich, ob ein Wagen zum Alltag passt.',
    href: '/sortiment/kinderwagen/',
    image: IMAGES.boutiqueGang,
  },
  {
    id: 'dies-das',
    label: 'Dies & Das',
    note: 'Geschenke & Accessoires',
    title: 'Für den Besuch nach der Geburt.',
    body: 'Kuscheltiere, Spieluhren, Holzspielzeug, Karten und Kleinigkeiten. Auf Wunsch verpackt, solange Sie im Laden sind.',
    href: '/sortiment/dies-das/',
    image: IMAGES.wareRegal,
  },
];
