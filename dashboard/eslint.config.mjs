/**
 * Eigene Lint-Regeln für das Dashboard.
 *
 * Aufruf aus dem Projektstamm: `pnpm dashboard:lint`.
 * Die Pfadmuster sind deshalb relativ zum Projektstamm angegeben.
 *
 * Bewusst getrennt von der Konfiguration im Projektstamm: dort greifen
 * Next.js-/React-Regeln, die auf diesen framework-freien Code nicht passen.
 * Hier stehen nur Regeln, die echte Fehler finden.
 */
import js from '@eslint/js';

const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  console: 'readonly',
  localStorage: 'readonly',
  sessionStorage: 'readonly',
  fetch: 'readonly',
  performance: 'readonly',
  location: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  requestAnimationFrame: 'readonly',
  globalThis: 'readonly',
  structuredClone: 'readonly',
  Node: 'readonly',
  Element: 'readonly',
  HTMLElement: 'readonly',
  CustomEvent: 'readonly',
  Blob: 'readonly',
  URL: 'readonly',
  URLSearchParams: 'readonly',
  FileReader: 'readonly',
  Intl: 'readonly',
  customElements: 'readonly',
  getComputedStyle: 'readonly',
};

const nodeGlobals = {
  process: 'readonly',
  console: 'readonly',
  Buffer: 'readonly',
  URL: 'readonly',
  setTimeout: 'readonly',
  __dirname: 'readonly',
};

export default [
  {
    ignores: [
      'dashboard/dist/**',
      // Vorlage mit Platzhaltern (/*__STYLES__*/), erst nach dem Build gueltiges JS.
      'dashboard/wix/public/custom-elements/element-template.js',
    ],
  },
  {
    files: ['dashboard/src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: browserGlobals,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  {
    files: ['dashboard/build.mjs', 'dashboard/scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...nodeGlobals, ...browserGlobals },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // Velo-Dateien laufen in der Wix-Umgebung; deren Module und $w sind dort global.
    files: ['dashboard/wix/**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...browserGlobals, $w: 'readonly', BizDash: 'readonly' },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
