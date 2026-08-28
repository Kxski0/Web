import { statement } from '@/content/startseite';
import { Reveal } from './Reveal';

/**
 * Vollbreiten-Bahn mit der groessten Schrift der Seite.
 *
 * Bricht bewusst aus dem 1200px-Raster aus und laeuft von Kante zu Kante.
 * Die Seite braucht Stellen, an denen der Rhythmus aussetzt — ohne sie
 * liest sich jede Sektion wie die vorige.
 *
 * Nur ein Wort traegt den Akzent. Waere der ganze Satz farbig, wuerde die
 * Betonung verschwinden.
 */
export function Statement() {
  return (
    <section className="surface-dark bg-carbon-warm py-32 md:py-48">
      <div className="container-page">
        <Reveal>
          <p className="text-mega font-light text-paper-white">
            {statement.zeilen.map((zeile) => (
              <span key={zeile} className="zeile">
                <span className={zeile === statement.betont ? 'text-kupfer-hell' : undefined}>
                  {zeile}
                </span>
              </span>
            ))}
          </p>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-12 max-w-xl text-body text-paper-white/70 md:ml-auto md:mt-16">
            {statement.text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
