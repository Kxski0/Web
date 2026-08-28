/**
 * Umgebungsabhaengige Site-Einstellungen.
 *
 * Einzige Quelle fuer Basis-URL und Indexierbarkeit — vorher lag die
 * Produktionsdomain dreimal im Code (Layout, Sitemap, robots) und haette
 * auseinanderlaufen koennen.
 */

const PRODUKTIONS_DOMAIN = 'https://www.energie-zentrum-saar.de';

/**
 * Laeuft dieses Deployment als Produktion?
 *
 * Vercel setzt VERCEL_ENV auf 'production', 'preview' oder 'development'.
 * Ist die Variable gar nicht gesetzt (lokale Entwicklung oder ein
 * selbst gehostetes Deployment), wird wie Produktion behandelt — sonst
 * waere eine spaetere Auslieferung auf eigenem Server versehentlich
 * dauerhaft auf noindex.
 */
export const istProduktion = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === 'production'
  : true;

/**
 * Basis-URL fuer Canonicals, Sitemap und Open Graph.
 *
 * Auf Vorschau-Deployments zeigt sie auf die Vorschau selbst. Wuerde dort
 * die Produktionsdomain stehen, verwiesen die Canonicals auf eine Domain,
 * die es noch gar nicht gibt.
 */
export const basisUrl = istProduktion
  ? (process.env.NEXT_PUBLIC_SITE_URL ?? PRODUKTIONS_DOMAIN)
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : (process.env.NEXT_PUBLIC_SITE_URL ?? PRODUKTIONS_DOMAIN);
