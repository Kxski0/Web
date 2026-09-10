import { createLocalAdapter } from './local.js';
import { createWixAdapter } from './wix.js';

/**
 * Wählt den Speicher.
 *
 * Steht auf `window.__BIZDASH_BRIDGE__` eine Wix-Brücke bereit (der Page-Code
 * setzt sie, bevor das Custom Element bootet), wird Wix Data verwendet.
 * Andernfalls der Browser-Speicher. Es gibt bewusst keinen stillen Wechsel zur
 * Laufzeit – ein Wechsel würde bedeuten, dass Daten an zwei Orten liegen.
 */
export async function createAdapter(options = {}) {
  const bridge = options.bridge || globalThis.__BIZDASH_BRIDGE__ || null;
  if (bridge) {
    const adapter = createWixAdapter(bridge);
    try {
      await adapter.init();
      return adapter;
    } catch (err) {
      // Fällt das Backend aus, ist ein stiller Wechsel auf lokale Daten falsch:
      // der Nutzer würde eine leere App sehen und für echt halten.
      throw new Error(`Wix-Backend nicht erreichbar: ${err?.message || err}`);
    }
  }
  const local = createLocalAdapter(options);
  await local.init();
  return local;
}

export { createLocalAdapter, createWixAdapter };
