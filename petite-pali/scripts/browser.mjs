/**
 * Gemeinsamer Browserstart für alle Prüf- und Screenshot-Skripte.
 *
 * Playwright erwartet genau den Browser-Build, der zu seiner Version gehört.
 * In Umgebungen, die Chromium bereits mitbringen (etwa vorbereitete
 * CI-Images), stimmt diese Nummer oft nicht überein, obwohl ein völlig
 * brauchbarer Chromium vorhanden ist. Statt jedes Skript daran scheitern zu
 * lassen, wird ein vorhandener Browser benutzt:
 *
 *   CHROMIUM_PATH=...        ausdrücklich gesetzt, hat Vorrang
 *   /opt/pw-browsers/chromium  üblicher Ort in vorbereiteten Images
 *   sonst                     Playwrights eigener Download
 */
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const CANDIDATES = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'].filter(Boolean);

export function launchBrowser(options = {}) {
  const executablePath = CANDIDATES.find((p) => existsSync(p));
  return chromium.launch(executablePath ? { executablePath, ...options } : options);
}
