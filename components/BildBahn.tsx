import { Bild, type SzenenName } from './Bild';

/**
 * Bild ueber die volle Breite.
 *
 * Bricht aus dem 1200px-Raster aus. Ohne solche Momente sitzt jedes Bild
 * gleich gross an derselben Stelle, und die Seite bekommt keinen Atem.
 * Bewusst ohne den 80px-Radius: Das Bild laeuft von Kante zu Kante, ein
 * gerundeter Vollbreiten-Block saehe nach Fehler aus.
 */
export function BildBahn({
  szene,
  foto,
  hoehe = 'h-[62svh] md:h-[78svh]',
}: {
  szene: SzenenName;
  foto?: string;
  hoehe?: string;
}) {
  return (
    <section className={`relative ${hoehe} overflow-hidden`}>
      <Bild szene={szene} foto={foto} fuellend sizes="100vw" />
    </section>
  );
}
