/**
 * Real reference projects only.
 *
 * This array is empty on purpose. No project has been supplied with verifiable
 * detail, and §43 forbids inventing one. Every consumer of this data must
 * render nothing when the list is empty rather than fall back to a placeholder
 * case study — a fabricated reference is worse than an absent section.
 *
 * See CONTENT-TODO.md for the fields required per project.
 */

export type Project = {
  slug: string;
  location: string;
  buildingType: string;
  /** Components actually installed, e.g. ['Photovoltaik', 'Stromspeicher']. */
  system: string[];
  completed: string;
  outcome: string;
  image: string;
  imageAlt: string;
};

export const PROJECTS: Project[] = [];
