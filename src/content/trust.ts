/**
 * Verifiable trust signals only: real reviews, real certificates, real partners,
 * real numbers. All empty until SolBauTec supplies documented values (§43).
 * Consumers render nothing on empty input.
 */

export type Testimonial = {
  quote: string;
  author: string;
  /** Platform the review is publicly verifiable on. */
  source: string;
  sourceUrl?: string;
};

export type Credential = {
  label: string;
  issuer: string;
};

export type KeyFigure = {
  value: string;
  label: string;
  /** How this number can be checked. Required — an unsourced number is invented. */
  basis: string;
};

export const TESTIMONIALS: Testimonial[] = [];
export const CREDENTIALS: Credential[] = [];
export const KEY_FIGURES: KeyFigure[] = [];
