/**
 * eslint-config-next 16 ships flat config directly, so it is imported rather
 * than bridged through FlatCompat — the eslintrc bridge cannot serialise the
 * plugin graph these configs now use.
 */
import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescriptConfig from 'eslint-config-next/typescript';

const config = [
  ...coreWebVitals,
  ...typescriptConfig,
  { ignores: ['.next/**', 'node_modules/**', 'scripts/**', 'public/**'] },
];

export default config;
