export type Beitrag = {
  slug: string;
  datum: string;
  titel: string;
  text: string;
};

/**
 * Die Beiträge der Seite „Aktuelles" aus dem bestehenden Auftritt.
 *
 * Diese Liste ist leer, weil die bestehenden Inhalte aus der Arbeitsumgebung
 * heraus nicht gelesen werden konnten — petite-pali.de ist am Gateway
 * gesperrt (403). Erfundene Beiträge wären das Schlechteste, was hier stehen
 * könnte, also steht hier nichts.
 *
 * Solange die Liste leer ist, zeigt /aktuelles/ keine erfundene Beitragsliste,
 * sondern verweist auf den Kanal, über den Neuigkeiten tatsächlich laufen.
 * Siehe CONTENT-TODO.md §7.
 */
export const BEITRAEGE: Beitrag[] = [];
