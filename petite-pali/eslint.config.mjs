/**
 * Eigene Flat-Config. Bewusst nicht die des Wurzelprojekts: Petite Pali und
 * SolBauTec teilen sich in diesem Repository nichts zur Laufzeit, und eine
 * geteilte Lint-Config wäre genau die Kopplung, die ausgeschlossen werden soll.
 */
import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescriptConfig from 'eslint-config-next/typescript';

const config = [
  ...coreWebVitals,
  ...typescriptConfig,
  { ignores: ['.next/**', 'node_modules/**', 'scripts/**', 'public/**'] },
];

export default config;
