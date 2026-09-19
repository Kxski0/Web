/**
 * Angaben zum Geschäft.
 *
 * REGEL: nichts hier wird erfunden. Ein Feld, das der Laden nicht bestätigt hat,
 * bleibt `null` und wird nirgends gerendert.
 *
 * Adresse, Rufnummern, E-Mail und Öffnungszeiten sind vom Auftraggeber
 * ausdrücklich bestätigt und deshalb in CONTACT eingetragen. Was für das
 * Impressum darüber hinaus nötig ist — Inhaber:in, Rechtsform, USt-IdNr. oder
 * Steuernummer — liegt noch nicht vor und steht in CONTENT-TODO.md.
 */

import { siteOrigin } from '@/lib/env';

export type PostalAddress = {
  street: string;
  postalCode: string;
  city: string;
  country: string;
};

export type OpeningHours = {
  /** Wochentage in schema.org-Schreibweise. */
  days: string[];
  /** Anzeigeform, z.B. „Montag bis Freitag“. */
  label: string;
  opens: string;
  closes: string;
};

export type SiteContact = {
  /** Erst auf true setzen, wenn jedes Feld darunter bestätigt ist. */
  verified: boolean;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  address: PostalAddress | null;
  /** Ortsbeschreibung, wie sie Kundinnen und Kunden benutzen würden. */
  neighbourhood: string | null;
  hours: OpeningHours[];
};

/**
 * Angaben für das Impressum nach § 5 DDG, die noch fehlen. Solange eines davon
 * `null` ist, weist die Impressumsseite ausdrücklich darauf hin und die
 * Indexierung bleibt aus.
 */
export type ImprintFields = {
  owner: string | null;
  legalForm: string | null;
  vatId: string | null;
  taxNumber: string | null;
};

export const SITE = {
  name: 'Petite Pali',
  descriptor: 'Baby & Kinder Boutique',
  /** Haltung, kein Werbespruch. */
  claim: 'Für die kleinen Menschen. Und die großen Momente dazwischen.',
  description:
    'Petite Pali ist eine inhabergeführte Baby- und Kinderboutique in der Kölner Südstadt: Mode ab Frühchengröße 44 bis Größe 122, Umstandsmode, Tragehilfen, Kinderwagen und ausgewählte Lieblingsstücke — handverlesen und persönlich beraten.',
  region: 'Köln',
  locale: 'de_DE',
  lang: 'de',
  instagram: {
    handle: '@petitepalikoeln',
    url: 'https://www.instagram.com/petitepalikoeln/',
  },
  url: siteOrigin(),
} as const;

export const CONTACT: SiteContact = {
  verified: true,
  phone: '+49 221 29490358',
  mobile: '+49 173 5362828',
  email: 'info@petite-pali.de',
  address: {
    street: 'Karolingerring 5',
    postalCode: '50678',
    city: 'Köln',
    country: 'DE',
  },
  neighbourhood: 'am Chlodwigplatz',
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], label: 'Montag bis Freitag', opens: '10:00', closes: '18:30' },
    { days: ['Saturday'], label: 'Samstag', opens: '10:00', closes: '17:00' },
  ],
};

export const IMPRINT: ImprintFields = {
  owner: null,
  legalForm: null,
  vatId: null,
  taxNumber: null,
};

/** Für Anzeige und `tel:`-Links getrennt: gesetzt wird das eine, gewählt das andere. */
export const formatPhone = (value: string) => value.replace(/^\+49 /, '0');
export const telHref = (value: string) => `tel:${value.replace(/\s/g, '')}`;
