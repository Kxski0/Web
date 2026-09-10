/**
 * Ablageort für Overlays (Dialoge, Suche, Kurzmeldungen).
 *
 * Warum nicht einfach `document.body`:
 *
 *  1. Die Farb- und Maßvariablen der Oberfläche sind auf `.bizdash` definiert,
 *     damit sie eine umgebende Seite nicht beeinflussen. Ein Dialog direkt am
 *     `body` liegt außerhalb dieses Bereichs – die Variablen lösen sich nicht
 *     auf und der Dialog erscheint ohne Hintergrund und ohne Schrift.
 *
 *  2. Im Wix Custom Element liegt die gesamte Anwendung in einem Shadow DOM.
 *     Ein Element am `body` läge außerhalb davon und bekäme das mitgelieferte
 *     Stylesheet überhaupt nicht zu sehen.
 *
 * Deshalb registriert `startApp` den Wurzelknoten der Anwendung, und alle
 * Overlays hängen sich dort ein.
 */
let root = null;

/** Wird beim Start einmal gesetzt. */
export function setOverlayRoot(element) {
  root = element || null;
}

/** Zielknoten für Overlays; Rückfall auf `document.body`. */
export function overlayRoot() {
  if (root && root.isConnected) return root;
  return document.body;
}

let previousOverflow = null;

/**
 * Sperrt bzw. entsperrt das Scrollen hinter einem Overlay.
 *
 * Bewusst als Inline-Stil am `body` und nicht über eine CSS-Klasse: das
 * Stylesheet der Anwendung liegt im Wix-Betrieb im Shadow DOM und kann den
 * `body` der umgebenden Seite gar nicht ansprechen. Der vorherige Wert wird
 * gemerkt und beim Entsperren zurückgesetzt, damit eine fremde Einstellung
 * der Wix-Seite erhalten bleibt.
 */
export function setScrollLock(locked) {
  const { body } = document;
  if (!body) return;
  if (locked) {
    if (previousOverflow === null) previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    return;
  }
  body.style.overflow = previousOverflow ?? '';
  previousOverflow = null;
}
