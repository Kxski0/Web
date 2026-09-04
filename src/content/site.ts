/**
 * Company facts.
 *
 * RULE (Master Concept §43): nothing in here may be invented. A field that is
 * not confirmed by SolBauTec stays `null` and the UI simply does not render it.
 *
 * The live site could not be read from this environment (egress policy blocks
 * solbautec.de), so contact details below are UNCONFIRMED third-party search
 * results, not a primary source. They are deliberately kept out of `contact`
 * and out of the structured data until someone at SolBauTec confirms them.
 * See CONTENT-TODO.md.
 */

export type PostalAddress = {
  street: string;
  postalCode: string;
  city: string;
  country: string;
};

export type SiteContact = {
  /** Flip to true only once every field below is confirmed by the client. */
  verified: boolean;
  phone: string | null;
  email: string | null;
  address: PostalAddress | null;
};

import { siteOrigin } from '@/lib/env';

export const SITE = {
  name: 'SolBauTec',
  /** Positioning, not a slogan. §1 */
  claim: 'Energie, die weiterdenkt.',
  description:
    'SolBauTec plant und realisiert Energiesysteme für Wohngebäude: Photovoltaik, Stromspeicher, Wärmepumpe und Energiemanagement als ein zusammenhängendes System.',
  /** Service region as stated in the brief §11. */
  region: 'Augsburg und Umgebung',
  locale: 'de_DE',
  lang: 'de',
  /**
   * Resolved per deployment: NEXT_PUBLIC_SITE_URL, else the Vercel production
   * domain, else the assumed domain. See src/lib/env.ts.
   */
  url: siteOrigin(),
} as const;

export const CONTACT: SiteContact = {
  verified: false,
  phone: null,
  email: null,
  address: null,
};

/**
 * Unconfirmed candidate values, parked here so they are not lost and not used.
 * Source: third-party web search summary, September 2026. NOT verified.
 * Do not promote into CONTACT without confirmation from SolBauTec.
 */
export const CONTACT_CANDIDATES_UNVERIFIED = {
  phone: '+49 152 14764440',
  email: 'info@solbautec.de',
  address: {
    street: 'Höchstetterstraße 12',
    postalCode: '86154',
    city: 'Augsburg',
    country: 'DE',
  },
} as const;
