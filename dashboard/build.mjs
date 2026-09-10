/**
 * Build.
 *
 * Erzeugt aus den ES-Modulen unter src/ drei Artefakte:
 *
 *   dist/dashboard.js          Bündel als IIFE, exportiert window.BizDash
 *   dist/dashboard.css         Stylesheet (minifiziert)
 *   dist/index.html            eigenständige Seite, die beides einbindet
 *   dist/dashboard-element.js  Wix Custom Element: Bündel + CSS + Registrierung
 *                              in einer einzigen Datei, wie es Velo erwartet
 *
 * Aufruf: node dashboard/build.mjs [--watch]
 */
import { build, context } from 'esbuild';
import { readFile, writeFile, mkdir, copyFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');
const watch = process.argv.includes('--watch');

const common = {
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es2020', 'safari15'],
  legalComments: 'none',
  logLevel: 'info',
};

async function buildBundle() {
  await build({
    ...common,
    entryPoints: [path.join(root, 'src/main.js')],
    outfile: path.join(dist, 'dashboard.js'),
    format: 'iife',
    globalName: 'BizDash',
  });
}

async function buildStyles() {
  await build({
    ...common,
    entryPoints: [path.join(root, 'src/app.css')],
    outfile: path.join(dist, 'dashboard.css'),
  });
}

/**
 * Eigenständige Seite. Anders als die Entwicklungsfassung lädt sie nur zwei
 * Dateien statt dreißig Module – das macht den Start auf dem iPad spürbar
 * schneller, besonders über Mobilfunk.
 */
async function buildHtml() {
  const source = await readFile(path.join(root, 'index.html'), 'utf8');
  const html = source
    .replace('<link rel="stylesheet" href="./src/app.css">', '<link rel="stylesheet" href="./dashboard.css">')
    .replace(/ {2}<!--\n {4}Entwicklungsbetrieb[\s\S]*?-->\n/, '')
    .replace(
      / {2}<script type="module">[\s\S]*?<\/script>/,
      `  <script src="./dashboard.js"></script>
  <script>
    BizDash.startApp({ container: document.getElementById('app') }).catch(function (err) {
      console.error(err);
      document.getElementById('app').textContent = 'Start fehlgeschlagen: ' + err.message;
    });
  </script>`,
    )
    .replace('href="./public/manifest.webmanifest"', 'href="./manifest.webmanifest"')
    .replace('href="./public/icon.svg"', 'href="./icon.svg"')
    .replace('href="./public/icon-180.png"', 'href="./icon-180.png"');

  await writeFile(path.join(dist, 'index.html'), html, 'utf8');
}

/**
 * Wix Custom Element.
 *
 * Velo lädt Dateien aus `public/custom-elements/` als eigenständiges Skript.
 * Deshalb muss hier alles in einer Datei stehen: Anwendung, Stylesheet und die
 * `customElements.define()`-Registrierung. Das CSS wird in den Shadow-DOM
 * gelegt, damit es die umgebende Wix-Seite nicht beeinflusst.
 */
async function buildCustomElement() {
  const js = await readFile(path.join(dist, 'dashboard.js'), 'utf8');
  const css = await readFile(path.join(dist, 'dashboard.css'), 'utf8');
  const template = await readFile(path.join(root, 'wix/public/custom-elements/element-template.js'), 'utf8');

  const out = template
    .replace('/*__BUNDLE__*/', () => js.replace(/\/\/# sourceMappingURL=.*$/m, ''))
    .replace('/*__STYLES__*/', () => JSON.stringify(css));

  const target = path.join(dist, 'dashboard-element.js');
  await writeFile(target, out, 'utf8');

  const kb = Math.round(Buffer.byteLength(out) / 1024);
  console.log(`  dashboard-element.js  ${kb} kB  (Wix Custom Element, eine Datei)`);
}

async function copyPublic() {
  const src = path.join(root, 'public');
  if (!existsSync(src)) return;
  for (const name of await readdir(src)) {
    await copyFile(path.join(src, name), path.join(dist, name));
  }
}

async function run() {
  await mkdir(dist, { recursive: true });
  await buildBundle();
  await buildStyles();
  await buildHtml();
  await copyPublic();
  await buildCustomElement();
  console.log('\nFertig. Ergebnis in dashboard/dist/');
}

if (watch) {
  const ctxJs = await context({
    ...common,
    minify: false,
    entryPoints: [path.join(root, 'src/main.js')],
    outfile: path.join(dist, 'dashboard.js'),
    format: 'iife',
    globalName: 'BizDash',
  });
  const ctxCss = await context({
    ...common,
    minify: false,
    entryPoints: [path.join(root, 'src/app.css')],
    outfile: path.join(dist, 'dashboard.css'),
  });
  await mkdir(dist, { recursive: true });
  await ctxJs.watch();
  await ctxCss.watch();
  await buildHtml();
  await copyPublic();
  console.log('Beobachte Änderungen …');
} else {
  await run();
}
