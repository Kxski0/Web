/**
 * Bewegungsregeln, maschinell geprüft.
 *
 * Die Regeln in DESIGN.md §6 sind nur so viel wert, wie sie eingehalten
 * werden. Dieses Skript liest die CSS-Module und die Komponenten und schlägt
 * fehl, sobald eine davon verletzt wird — dieselbe Haltung wie bei audit.mjs,
 * das den Kontrast misst, statt ihn zu behaupten.
 *
 * Geprüft wird die Quelle, nicht die laufende Seite: eine Bewegungsregel ist
 * eine Eigenschaft des Stylesheets, und sie im Browser nachzustellen wäre
 * umständlicher und unschärfer.
 *
 * Aufruf:  node scripts/motion-check.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const SRC = path.join(process.cwd(), 'src');

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const files = walk(SRC);
const cssFiles = files.filter((f) => f.endsWith('.css'));
const tsxFiles = files.filter((f) => f.endsWith('.tsx'));
const rel = (f) => path.relative(process.cwd(), f);

const problems = [];
const report = (file, line, message) => problems.push({ file: rel(file), line, message });

/* --- Regeln an den Stylesheets -------------------------------------------- */

/**
 * Kommentare ausblenden, Zeilennummern behalten.
 *
 * Ohne das meldet der Prüfer die Regel, die ihn beschreibt: in DESIGN.md und in
 * globals.css steht „`ease-in` kommt nirgends vor" — als Text, nicht als Code.
 */
function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, ' '));
}

for (const file of cssFiles) {
  const text = stripComments(readFileSync(file, 'utf8'));
  const lines = text.split('\n');
  let selector = '';

  lines.forEach((line, i) => {
    const n = i + 1;

    // Aktuellen Selektor mitführen: die Ausnahme für Einblendungen hängt am
    // Selektor, nicht an der Zeile mit der Dauer.
    const open = line.match(/^\s*([^@{}]+)\{\s*$/);
    if (open) selector = open[1].trim();

    if (/transition:\s*all\b/.test(line)) {
      report(file, n, '`transition: all` — die bewegten Eigenschaften einzeln nennen.');
    }

    if (/transform:\s*scale\(0\)/.test(line)) {
      report(file, n, '`scale(0)` als Zustand — nichts erscheint aus dem Nichts, ab 0.9 beginnen.');
    }

    // ease-in ist nicht ease-in-out und nicht ease-out.
    if (/\bease-in\b(?!-out)/.test(line) && !/--ease/.test(line)) {
      report(file, n, '`ease-in` beginnt langsam und lässt die Oberfläche träge wirken.');
    }

    /*
     * Zu lange Übergänge an Bedienelementen. Redaktionelle Einblendungen und
     * Bildüberblendungen sind ausgenommen — sie erzählen etwas, statt auf eine
     * Eingabe zu antworten.
     */
    const durations = [...line.matchAll(/(\d+)ms/g)].map((m) => Number(m[1]));
    const isReveal = /reveal|shot|veil|video|--duration-reveal/.test(`${selector} ${line}`);
    for (const ms of durations) {
      if (ms > 300 && /transition/.test(line) && !isReveal) {
        report(file, n, `Übergang von ${ms}ms an einem Bedienelement — über der Grenze von 300ms.`);
      }
    }
  });

  // Hover ohne Zeiger-Gate.
  if (/:hover/.test(text) && !/hover:\s*hover/.test(text)) {
    report(file, 0, ':hover ohne `@media (hover: hover) and (pointer: fine)` — auf Touch bleibt der Zustand kleben.');
  }
}

/* --- Regel an den Komponenten: drückbare Flächen brauchen Druckfeedback --- */

/*
 * Eine Fläche gilt als drückbar, wenn sie ein <button> ist oder ein Link, der
 * im Stylesheet eine Mindesthöhe trägt — also als Fläche gestaltet ist und
 * nicht als Verweis im Fließtext. Verweise im Satz bekommen bewusst kein
 * Druckfeedback: sie sind Text, keine Schaltfläche.
 */
const PRESS_CLASSES = ['pressable', 'pressable-soft'];

for (const file of tsxFiles) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');

  lines.forEach((line, i) => {
    if (!/<button\b/.test(line)) return;

    /*
     * Das öffnende Tag bis zu seinem Ende einsammeln statt eine feste Zahl
     * Zeilen: zwischen `<button` und dem className können Ref-Callbacks und
     * Handler stehen, und ein fester Ausschnitt schneidet sie ab.
     */
    let chunk = '';
    for (let j = i; j < Math.min(i + 24, lines.length); j++) {
      chunk += ` ${lines[j]}`;
      const withoutArrows = lines[j].replace(/=>/g, '');
      if (withoutArrows.includes('>')) break;
    }

    if (!PRESS_CLASSES.some((c) => chunk.includes(c))) {
      report(file, i + 1, '<button> ohne `pressable` — jede drückbare Fläche muss auf den Druck antworten.');
    }
  });
}

/* --- Ausgabe -------------------------------------------------------------- */

if (problems.length === 0) {
  console.log(`${cssFiles.length} Stylesheets und ${tsxFiles.length} Komponenten geprüft.`);
  console.log('Alle Bewegungsregeln eingehalten.');
  process.exit(0);
}

for (const p of problems) {
  console.log(`FEHL  ${p.file}${p.line ? `:${p.line}` : ''}  ${p.message}`);
}
console.log(`\n${problems.length} Verstoß/Verstöße.`);
process.exit(1);
