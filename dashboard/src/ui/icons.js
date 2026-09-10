/**
 * Icons als Inline-SVG.
 *
 * Kein Icon-Font, keine externe Datei: das spart einen Netzwerk-Roundtrip beim
 * Start und funktioniert in jeder Einbettung. Alle Pfade sind auf einem
 * 24x24-Raster gezeichnet und erben die Textfarbe.
 */
import { svg } from './dom.js';

const PATHS = {
  dashboard: ['M3 12h7V3H3zM14 21h7v-9h-7zM14 8h7V3h-7zM3 21h7v-5H3z'],
  users: ['M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8', 'M22 20v-2a4 4 0 0 0-3-3.9', 'M16 2.1a4 4 0 0 1 0 7.8'],
  briefcase: ['M3 8h18v12H3z', 'M9 8V5h6v3', 'M3 13h18'],
  invoice: ['M6 2h9l3 3v17l-3-2-3 2-3-2-3 2z', 'M9 8h6', 'M9 12h6', 'M9 16h4'],
  globe: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18', 'M3 12h18', 'M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18'],
  sparkle: ['M12 3l2.2 5.6L20 11l-5.8 2.4L12 19l-2.2-5.6L4 11l5.8-2.4z'],
  folder: ['M3 6h6l2 3h10v11H3z'],
  check: ['M4 12l5 5L20 6'],
  checklist: ['M4 6h16', 'M4 12h16', 'M4 18h10'],
  euro: ['M17 5a7 7 0 1 0 0 14', 'M4 10h8', 'M4 14h8'],
  activity: ['M3 12h4l3 8 4-16 3 8h4'],
  settings: ['M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7', 'M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1'],
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16', 'M21 21l-4.3-4.3'],
  plus: ['M12 5v14', 'M5 12h14'],
  edit: ['M4 20h4L20 8l-4-4L4 16z'],
  trash: ['M4 7h16', 'M10 11v6', 'M14 11v6', 'M6 7l1 13h10l1-13', 'M9 7V4h6v3'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  chevronRight: ['M9 6l6 6-6 6'],
  chevronDown: ['M6 9l6 6 6-6'],
  arrowLeft: ['M19 12H5', 'M12 19l-7-7 7-7'],
  external: ['M14 4h6v6', 'M20 4l-9 9', 'M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5'],
  calendar: ['M4 6h16v15H4z', 'M4 10h16', 'M8 3v4', 'M16 3v4'],
  warning: ['M12 4l9 16H3z', 'M12 10v4', 'M12 17.5v.5'],
  download: ['M12 4v11', 'M8 12l4 4 4-4', 'M4 20h16'],
  upload: ['M12 20V9', 'M8 12l4-4 4 4', 'M4 4h16'],
  refresh: ['M20 12a8 8 0 1 1-2.3-5.6', 'M20 4v5h-5'],
  filter: ['M3 5h18', 'M6 12h12', 'M10 19h4'],
  grid: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M14 14h7v7h-7z', 'M3 14h7v7H3z'],
  list: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
  link: ['M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1', 'M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1'],
  image: ['M3 5h18v14H3z', 'M3 16l5-5 4 4 3-3 6 6'],
  mail: ['M3 6h18v12H3z', 'M3 7l9 6 9-6'],
  phone: ['M6 3h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1z'],
  clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18', 'M12 7v5l3 2'],
};

/**
 * @param {string} name Schlüssel aus PATHS
 * @param {{size?: number, class?: string}} options
 */
export function icon(name, options = {}) {
  const paths = PATHS[name] || PATHS.dashboard;
  const size = options.size || 20;
  const node = svg(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': options.weight || 1.75,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'aria-hidden': 'true',
      focusable: 'false',
      class: options.class || 'icon',
    },
    ...paths.map((d) => svg('path', { d })),
  );
  return node;
}
